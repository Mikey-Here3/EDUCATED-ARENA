import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { withdrawalSchema } from '@/lib/validation/schemas';
import { createLedgerEntry } from '@/lib/financial/ledger';
import { PaymentMethodType, WithdrawalStatus, NotificationType, TransactionType, Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = withdrawalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid withdrawal parameters', details: parsed.error.format() }, { status: 400 });
    }

    const { amount, method, accountNumber, accountTitle, userNote } = parsed.data;

    // Must be >= PKR 200
    if (amount < 200) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is PKR 200' }, { status: 400 });
    }

    const withdrawal = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId: session.id },
      });

      if (!wallet || wallet.availableBalance.toNumber() < amount) {
        throw new Error(
          `Insufficient available balance. You have PKR ${wallet?.availableBalance.toNumber() || 0}, but requested PKR ${amount}.`
        );
      }

      const newWithdrawal = await tx.withdrawal.create({
        data: {
          userId: session.id,
          walletId: wallet.id,
          amount: new Prisma.Decimal(amount),
          currency: 'PKR',
          method: method as PaymentMethodType,
          accountNumber,
          accountName: accountTitle || session.displayName,
          accountTitle,
          userNote,
          status: WithdrawalStatus.PENDING,
        },
      });

      // Lock funds atomically in pending balance
      await createLedgerEntry(tx, {
        walletId: wallet.id,
        userId: session.id,
        type: TransactionType.WITHDRAWAL_REQUEST,
        amount,
        description: `Withdrawal request #${newWithdrawal.id.slice(-6)} submitted`,
        withdrawalId: newWithdrawal.id,
        idempotencyKey: `with_req_${newWithdrawal.id}`,
      });

      // Notify user
      await tx.notification.create({
        data: {
          userId: session.id,
          type: NotificationType.WITHDRAWAL_SUBMITTED,
          title: 'Withdrawal Requested',
          message: `Your withdrawal request of PKR ${amount} to ${accountNumber} (${method}) is pending processing.`,
          linkUrl: '/dashboard/wallet',
        },
      });

      return newWithdrawal;
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted. It will be reviewed and processed to your mobile account.',
      withdrawalId: withdrawal.id,
    });
  } catch (error: any) {
    console.error('Withdrawal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit withdrawal' }, { status: 500 });
  }
}
