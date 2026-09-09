import { describe, it, expect, vi } from 'vitest';
import { createLedgerEntry, reserveFunds, releaseFunds, rejectWithdrawal } from '../src/lib/financial/ledger';
import { TransactionType, Prisma } from '@prisma/client';

describe('Financial Double-Entry Ledger & Wallet Invariants', () => {
  it('should reserve funds atomically and prevent negative available balance', async () => {
    const mockTx = {
      wallet: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'w_1',
          userId: 'u_1',
          availableBalance: new Prisma.Decimal(100),
          reservedBalance: new Prisma.Decimal(0),
          pendingBalance: new Prisma.Decimal(0),
          totalWinnings: new Prisma.Decimal(0),
          totalDeposits: new Prisma.Decimal(100),
          totalWithdrawals: new Prisma.Decimal(0),
        }),
        update: vi.fn(),
      },
      ledgerTransaction: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: 'tx_1' }),
      },
    };

    await reserveFunds(mockTx as any, {
      userId: 'u_1',
      amount: 40,
      matchId: 'm_1',
      description: 'Match reservation',
    });

    expect(mockTx.wallet.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'w_1' },
        data: expect.objectContaining({
          availableBalance: new Prisma.Decimal(60),
          reservedBalance: new Prisma.Decimal(40),
        }),
      })
    );
  });

  it('should throw error when available funds are insufficient', async () => {
    const mockTx = {
      wallet: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'w_1',
          userId: 'u_1',
          availableBalance: new Prisma.Decimal(20),
          reservedBalance: new Prisma.Decimal(0),
          pendingBalance: new Prisma.Decimal(0),
          totalWinnings: new Prisma.Decimal(0),
          totalDeposits: new Prisma.Decimal(20),
          totalWithdrawals: new Prisma.Decimal(0),
        }),
        update: vi.fn(),
      },
      ledgerTransaction: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn(),
      },
    };

    await expect(
      reserveFunds(mockTx as any, {
        userId: 'u_1',
        amount: 50,
        matchId: 'm_1',
        description: 'Over-reservation attempt',
      })
    ).rejects.toThrow('Insufficient available funds');
  });

  it('should lock withdrawal in pending balance and refund on rejection', async () => {
    const mockTx = {
      wallet: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'w_1',
          userId: 'u_1',
          availableBalance: new Prisma.Decimal(500),
          reservedBalance: new Prisma.Decimal(0),
          pendingBalance: new Prisma.Decimal(0),
          totalWinnings: new Prisma.Decimal(0),
          totalDeposits: new Prisma.Decimal(500),
          totalWithdrawals: new Prisma.Decimal(0),
        }),
        update: vi.fn(),
      },
      withdrawal: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'with_1',
          userId: 'u_1',
          amount: new Prisma.Decimal(200),
          status: 'REJECTED',
        }),
      },
      ledgerTransaction: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: 'tx_with' }),
      },
    };

    // 1. Withdrawal request locks funds in pending balance
    await createLedgerEntry(mockTx as any, {
      walletId: 'w_1',
      userId: 'u_1',
      type: TransactionType.WITHDRAWAL_REQUEST,
      amount: 200,
      description: 'Withdrawal requested',
      withdrawalId: 'with_1',
      idempotencyKey: 'req_with_1',
    });

    expect(mockTx.wallet.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          availableBalance: new Prisma.Decimal(300),
          pendingBalance: new Prisma.Decimal(200),
        }),
      })
    );

    // 2. Rejecting withdrawal restores available balance and clears pending
    mockTx.wallet.findUnique.mockResolvedValue({
      id: 'w_1',
      userId: 'u_1',
      availableBalance: new Prisma.Decimal(300),
      reservedBalance: new Prisma.Decimal(0),
      pendingBalance: new Prisma.Decimal(200),
      totalWinnings: new Prisma.Decimal(0),
      totalDeposits: new Prisma.Decimal(500),
      totalWithdrawals: new Prisma.Decimal(0),
    });

    await rejectWithdrawal(mockTx as any, 'with_1');

    expect(mockTx.wallet.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          availableBalance: new Prisma.Decimal(500),
          pendingBalance: new Prisma.Decimal(0),
        }),
      })
    );
  });
});
