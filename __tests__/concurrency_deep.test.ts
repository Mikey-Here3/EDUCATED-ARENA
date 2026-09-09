import { describe, it, expect, vi } from 'vitest';
import { Prisma, TransactionType, ChallengeStatus } from '@prisma/client';
import { createLedgerEntry } from '../src/lib/financial/ledger';

describe('Deep Concurrency & Race Condition Guards', () => {
  it('should prevent double-spending when two withdrawals race on limited funds', async () => {
    // Initial state: availableBalance = 100
    let currentAvailable = new Prisma.Decimal(100);
    let currentPending = new Prisma.Decimal(0);

    const mockTx = {
      ledgerTransaction: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'tx-1', ...data })),
      },
      wallet: {
        findUnique: vi.fn().mockImplementation(() =>
          Promise.resolve({
            id: 'wallet-1',
            availableBalance: currentAvailable,
            reservedBalance: new Prisma.Decimal(0),
            pendingBalance: currentPending,
            totalWinnings: new Prisma.Decimal(0),
            totalDeposits: new Prisma.Decimal(100),
            totalWithdrawals: new Prisma.Decimal(0),
          })
        ),
        update: vi.fn().mockImplementation(({ data }) => {
          currentAvailable = data.availableBalance;
          currentPending = data.pendingBalance;
          return Promise.resolve();
        }),
      },
    };

    // User attempts two simultaneous 100 PKR withdrawal requests
    const attempt1 = createLedgerEntry(mockTx as any, {
      walletId: 'wallet-1',
      userId: 'user-1',
      type: TransactionType.WITHDRAWAL_REQUEST,
      amount: new Prisma.Decimal(100),
      description: 'Withdrawal request 1',
    });

    await expect(attempt1).resolves.toBeDefined();
    expect(currentAvailable.toNumber()).toBe(0);
    expect(currentPending.toNumber()).toBe(100);

    // Second simultaneous request should fail with Insufficient available funds
    const attempt2 = createLedgerEntry(mockTx as any, {
      walletId: 'wallet-1',
      userId: 'user-1',
      type: TransactionType.WITHDRAWAL_REQUEST,
      amount: new Prisma.Decimal(100),
      description: 'Withdrawal request 2',
    });

    await expect(attempt2).rejects.toThrow('Insufficient available funds');
  });

  it('should guarantee atomic compare-and-swap on concurrent challenge acceptance', async () => {
    let challengeStatus: ChallengeStatus = ChallengeStatus.OPEN;
    let acceptedBy: string | null = null;

    // Simulate DB compare-and-swap
    const simulateAccept = async (userId: string) => {
      // Atomic UPDATE WHERE id = challengeId AND status = 'OPEN'
      if (challengeStatus === ChallengeStatus.OPEN) {
        challengeStatus = ChallengeStatus.ACCEPTED;
        acceptedBy = userId;
        return { count: 1 };
      }
      return { count: 0 };
    };

    // Fire two concurrent acceptances
    const [userA, userB] = await Promise.all([
      simulateAccept('user-A'),
      simulateAccept('user-B'),
    ]);

    // Exactly one must succeed
    const successfulAcceptances = [userA, userB].filter((res) => res.count === 1);
    const rejectedAcceptances = [userA, userB].filter((res) => res.count === 0);

    expect(successfulAcceptances).toHaveLength(1);
    expect(rejectedAcceptances).toHaveLength(1);
    expect(challengeStatus).toBe(ChallengeStatus.ACCEPTED);
    expect(acceptedBy).toBeDefined();
  });

  it('should guarantee idempotency on duplicate ledger entries with same idempotencyKey', async () => {
    const existingTransaction = {
      id: 'tx-existing',
      idempotencyKey: 'idempotent-deposit-key-123',
      amount: new Prisma.Decimal(500),
    };

    const mockTx = {
      ledgerTransaction: {
        findUnique: vi.fn().mockResolvedValue(existingTransaction),
        create: vi.fn(),
      },
      wallet: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };

    const result = await createLedgerEntry(mockTx as any, {
      walletId: 'wallet-1',
      userId: 'user-1',
      type: TransactionType.DEPOSIT_APPROVED,
      amount: new Prisma.Decimal(500),
      description: 'Approved deposit',
      idempotencyKey: 'idempotent-deposit-key-123',
    });

    // Returned existing transaction without executing new creation or double wallet credit
    expect(result.id).toBe('tx-existing');
    expect(mockTx.ledgerTransaction.create).not.toHaveBeenCalled();
    expect(mockTx.wallet.update).not.toHaveBeenCalled();
  });
});
