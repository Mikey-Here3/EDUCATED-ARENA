import { describe, it, expect, vi } from 'vitest';
import { settleMatch } from '../src/lib/financial/settlement';
import { Prisma } from '@prisma/client';
import prisma from '../src/lib/db';
import * as ledger from '../src/lib/financial/ledger';

vi.mock('../src/lib/db', () => ({
  default: {
    $transaction: vi.fn((callback) => callback(prisma)),
    match: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    wallet: {
      findUnique: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    }
  }
}));

vi.mock('../src/lib/financial/ledger', () => ({
  createLedgerEntry: vi.fn(),
  creditWinnings: vi.fn(),
  releaseFunds: vi.fn(),
}));

vi.mock('../src/lib/services/settings.service', () => ({
  getSetting: vi.fn().mockResolvedValue(10), // 10% platform fee
}));

describe('Match Settlement', () => {
  it('should refund 10 PKR to the loser and commit the rest', async () => {
    const mockMatch = {
      id: 'match_1',
      publicId: 'EG-M-1',
      status: 'RESULT_VERIFIED',
      prizePool: new Prisma.Decimal(100),
      entryFee: new Prisma.Decimal(50),
      result: { winnerSide: 1, loserSide: 2 },
      participants: [
        { userId: 'winner_1', side: 1 },
        { userId: 'loser_1', side: 2 },
      ],
      rosters: [],
      settlementKey: null,
    };

    (prisma.match.findUnique as any).mockResolvedValue(mockMatch);
    (prisma.wallet.findUnique as any).mockResolvedValue({ id: 'w1', userId: 'loser_1' });

    await settleMatch('match_1', 'admin_1');

    expect(ledger.releaseFunds).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: 'loser_1',
        amount: new Prisma.Decimal(10),
      })
    );

    expect(ledger.createLedgerEntry).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: 'loser_1',
        amount: new Prisma.Decimal(40), // 50 - 10 = 40
        type: 'MATCH_SETTLEMENT',
      })
    );
  });
});
