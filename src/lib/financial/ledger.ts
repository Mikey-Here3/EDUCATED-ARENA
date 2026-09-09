import { Prisma, PrismaClient, TransactionType, TransactionStatus, WithdrawalStatus } from '@prisma/client';
import { WalletSummary } from '@/types';
import { Decimal } from '@prisma/client/runtime/library';

type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

interface CreateLedgerEntryParams {
  walletId: string;
  userId: string;
  type: TransactionType;
  amount: Decimal | number;
  description: string;
  referenceType?: string;
  referenceId?: string;
  matchId?: string;
  depositId?: string;
  withdrawalId?: string;
  actorId?: string;
  idempotencyKey?: string;
  metadata?: unknown;
}

export async function createLedgerEntry(
  tx: PrismaTransaction,
  params: CreateLedgerEntryParams
) {
  if (params.idempotencyKey) {
    const existing = await tx.ledgerTransaction.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
    });
    if (existing) return existing;
  }

  const wallet = await tx.wallet.findUnique({
    where: { id: params.walletId },
  });

  if (!wallet) throw new Error('Wallet not found');

  const amountDecimal = new Prisma.Decimal(params.amount.toString());
  const balanceBefore = wallet.availableBalance;

  let balanceAfter = balanceBefore;
  let reservedAfter = wallet.reservedBalance;
  let pendingAfter = wallet.pendingBalance;
  let winningsAfter = wallet.totalWinnings;
  let depositsAfter = wallet.totalDeposits;
  let withdrawalsAfter = wallet.totalWithdrawals;

  switch (params.type) {
    case TransactionType.DEPOSIT:
    case TransactionType.DEPOSIT_APPROVED:
      balanceAfter = balanceBefore.plus(amountDecimal);
      depositsAfter = depositsAfter.plus(amountDecimal);
      break;

    case TransactionType.ADMIN_ADJUSTMENT:
    case TransactionType.REFUND:
    case TransactionType.MATCH_RESERVATION_RELEASE:
      balanceAfter = balanceBefore.plus(amountDecimal);
      if (params.type === TransactionType.MATCH_RESERVATION_RELEASE) {
        reservedAfter = reservedAfter.minus(amountDecimal);
      }
      break;

    case TransactionType.WINNING_CREDIT:
      balanceAfter = balanceBefore.plus(amountDecimal);
      winningsAfter = winningsAfter.plus(amountDecimal);
      break;

    case TransactionType.WITHDRAWAL_REQUEST:
      balanceAfter = balanceBefore.minus(amountDecimal);
      pendingAfter = pendingAfter.plus(amountDecimal);
      break;

    case TransactionType.WITHDRAWAL_PAID:
      pendingAfter = pendingAfter.minus(amountDecimal);
      withdrawalsAfter = withdrawalsAfter.plus(amountDecimal);
      break;

    case TransactionType.WITHDRAWAL_REJECTED:
      pendingAfter = pendingAfter.minus(amountDecimal);
      balanceAfter = balanceBefore.plus(amountDecimal);
      break;

    case TransactionType.PLATFORM_FEE:
      balanceAfter = balanceBefore.minus(amountDecimal);
      break;

    case TransactionType.MATCH_RESERVATION:
      balanceAfter = balanceBefore.minus(amountDecimal);
      reservedAfter = reservedAfter.plus(amountDecimal);
      break;

    case TransactionType.MATCH_SETTLEMENT:
      reservedAfter = reservedAfter.minus(amountDecimal);
      break;

    default:
      break;
  }

  if (balanceAfter.isNegative()) {
    throw new Error('Insufficient available funds');
  }
  if (reservedAfter.isNegative()) {
    throw new Error('Insufficient reserved funds');
  }
  if (pendingAfter.isNegative()) {
    throw new Error('Insufficient pending funds');
  }

  // Defensively verify matchId to prevent Foreign Key constraint violation
  let verifiedMatchId: string | undefined = undefined;
  let finalRefType = params.referenceType;
  let finalRefId = params.referenceId;

  if (params.matchId) {
    const matchExists = await tx.match.findUnique({
      where: { id: params.matchId },
      select: { id: true },
    });
    if (matchExists) {
      verifiedMatchId = params.matchId;
    } else {
      // If match doesn't exist yet (e.g. challenge reservation), store under referenceId
      finalRefType = finalRefType || 'CHALLENGE_OR_TEMP';
      finalRefId = finalRefId || params.matchId;
    }
  }

  const entry = await tx.ledgerTransaction.create({
    data: {
      walletId: params.walletId,
      userId: params.userId,
      type: params.type,
      status: TransactionStatus.COMPLETED,
      amount: amountDecimal,
      balanceBefore,
      balanceAfter,
      description: params.description,
      referenceType: finalRefType,
      referenceId: finalRefId,
      matchId: verifiedMatchId,
      depositId: params.depositId,
      withdrawalId: params.withdrawalId,
      actorId: params.actorId,
      idempotencyKey: params.idempotencyKey,
      metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
    },
  });

  await tx.wallet.update({
    where: { id: params.walletId },
    data: {
      availableBalance: balanceAfter,
      reservedBalance: reservedAfter,
      pendingBalance: pendingAfter,
      totalWinnings: winningsAfter,
      totalDeposits: depositsAfter,
      totalWithdrawals: withdrawalsAfter,
    },
  });

  return entry;
}

export async function getBalance(userId: string): Promise<WalletSummary> {
  const { prisma } = await import('@/lib/db');

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    throw new Error('Wallet not found for user');
  }

  return {
    available: wallet.availableBalance.toNumber(),
    reserved: wallet.reservedBalance.toNumber(),
    pending: wallet.pendingBalance.toNumber(),
    totalWinnings: wallet.totalWinnings.toNumber(),
    totalDeposits: wallet.totalDeposits.toNumber(),
    totalWithdrawals: wallet.totalWithdrawals.toNumber(),
    lifetimeEarnings: wallet.totalWinnings.toNumber(),
    currency: wallet.currency,
  };
}

export async function reserveFunds(
  tx: PrismaTransaction,
  params: {
    userId: string;
    amount: number | Decimal;
    matchId?: string;
    referenceType?: string;
    referenceId?: string;
    description: string;
  }
) {
  const wallet = await tx.wallet.findUnique({ where: { userId: params.userId } });
  if (!wallet) throw new Error('Wallet not found');

  const refKey = params.matchId || params.referenceId || Date.now().toString();

  return createLedgerEntry(tx, {
    walletId: wallet.id,
    userId: params.userId,
    type: TransactionType.MATCH_RESERVATION,
    amount: params.amount,
    description: params.description,
    matchId: params.matchId,
    referenceType: params.referenceType || (params.matchId ? 'MATCH' : 'RESERVATION'),
    referenceId: params.referenceId || params.matchId,
    idempotencyKey: `reserve_${refKey}_${params.userId}`,
  });
}

export async function releaseFunds(
  tx: PrismaTransaction,
  params: {
    userId: string;
    amount: number | Decimal;
    matchId?: string;
    referenceType?: string;
    referenceId?: string;
    description: string;
  }
) {
  const wallet = await tx.wallet.findUnique({ where: { userId: params.userId } });
  if (!wallet) throw new Error('Wallet not found');

  const refKey = params.matchId || params.referenceId || Date.now().toString();

  return createLedgerEntry(tx, {
    walletId: wallet.id,
    userId: params.userId,
    type: TransactionType.MATCH_RESERVATION_RELEASE,
    amount: params.amount,
    description: params.description,
    matchId: params.matchId,
    referenceType: params.referenceType || (params.matchId ? 'MATCH' : 'RELEASE'),
    referenceId: params.referenceId || params.matchId,
    idempotencyKey: `release_${refKey}_${params.userId}`,
  });
}

export async function creditWinnings(
  tx: PrismaTransaction,
  params: { userId: string; amount: number | Decimal; matchId: string; description: string }
) {
  const wallet = await tx.wallet.findUnique({ where: { userId: params.userId } });
  if (!wallet) throw new Error('Wallet not found');

  return createLedgerEntry(tx, {
    walletId: wallet.id,
    userId: params.userId,
    type: TransactionType.WINNING_CREDIT,
    amount: params.amount,
    description: params.description,
    matchId: params.matchId,
    idempotencyKey: `win_${params.matchId}_${params.userId}`,
  });
}

export async function processDeposit(tx: PrismaTransaction, depositId: string) {
  const deposit = await tx.deposit.findUnique({ where: { id: depositId } });
  if (!deposit || deposit.status !== 'APPROVED') throw new Error('Invalid deposit');

  const wallet = await tx.wallet.findUnique({ where: { userId: deposit.userId } });
  if (!wallet) throw new Error('Wallet not found');

  return createLedgerEntry(tx, {
    walletId: wallet.id,
    userId: deposit.userId,
    type: TransactionType.DEPOSIT_APPROVED,
    amount: deposit.amount,
    description: 'Deposit approved',
    depositId: deposit.id,
    idempotencyKey: `dep_${deposit.id}`,
  });
}

export async function processWithdrawal(tx: PrismaTransaction, withdrawalId: string) {
  const withdrawal = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
  if (!withdrawal || withdrawal.status !== WithdrawalStatus.PAID) throw new Error('Invalid withdrawal');

  const wallet = await tx.wallet.findUnique({ where: { userId: withdrawal.userId } });
  if (!wallet) throw new Error('Wallet not found');

  return createLedgerEntry(tx, {
    walletId: wallet.id,
    userId: withdrawal.userId,
    type: TransactionType.WITHDRAWAL_PAID,
    amount: withdrawal.amount,
    description: 'Withdrawal completed',
    withdrawalId: withdrawal.id,
    idempotencyKey: `with_${withdrawal.id}`,
  });
}

export async function rejectWithdrawal(tx: PrismaTransaction, withdrawalId: string) {
  const withdrawal = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
  if (!withdrawal || withdrawal.status !== WithdrawalStatus.REJECTED) throw new Error('Invalid withdrawal');

  const wallet = await tx.wallet.findUnique({ where: { userId: withdrawal.userId } });
  if (!wallet) throw new Error('Wallet not found');

  return createLedgerEntry(tx, {
    walletId: wallet.id,
    userId: withdrawal.userId,
    type: TransactionType.WITHDRAWAL_REJECTED,
    amount: withdrawal.amount,
    description: 'Withdrawal rejected - funds refunded',
    withdrawalId: withdrawal.id,
    idempotencyKey: `with_rej_${withdrawal.id}`,
  });
}

export async function adminAdjustment(params: {
  userId: string;
  amount: number | Decimal;
  reason: string;
  actorId: string;
}) {
  const { prisma } = await import('@/lib/db');

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId: params.userId } });
    if (!wallet) throw new Error('Wallet not found');

    const entry = await createLedgerEntry(tx, {
      walletId: wallet.id,
      userId: params.userId,
      type: TransactionType.ADMIN_ADJUSTMENT,
      amount: params.amount,
      description: params.reason,
      actorId: params.actorId,
    });

    await tx.auditLog.create({
      data: {
        actorId: params.actorId,
        action: 'ADMIN_WALLET_ADJUSTMENT',
        targetType: 'WALLET',
        targetId: wallet.id,
        metadata: { amount: params.amount.toString(), reason: params.reason },
      },
    });

    return entry;
  });
}
