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
    },
  },
}));

vi.mock('../src/lib/financial/ledger', () => ({
  createLedgerEntry: vi.fn(),
  creditWinnings: vi.fn(),
  releaseFunds: vi.fn(),
}));

vi.mock('../src/lib/services/settings.service', () => ({
  getSetting: vi.fn().mockResolvedValue(10), // 10% platform fee
}));

describe('Match Settlement Comprehensive Suite', () => {
  it('should split prize pool equally among multiple roster winners in integer PKR', async () => {
    // Prize pool = 1000 PKR, Platform fee = 10% (100 PKR), Winner pool = 900 PKR
    // 4 winning roster players -> 900 / 4 = 225 PKR each
    const mockMatch = {
      id: 'match_team_4v4',
      publicId: 'EG-M-4V4',
      status: 'RESULT_VERIFIED',
      prizePool: new Prisma.Decimal(1000),
      entryFee: new Prisma.Decimal(125),
      result: { winnerSide: 1, loserSide: 2 },
      participants: [
        { userId: 'leader_1', side: 1 },
        { userId: 'leader_2', side: 2 },
      ],
      rosters: [
        { userId: 'p1', isRegistered: true },
        { userId: 'p2', isRegistered: true },
        { userId: 'p3', isRegistered: true },
        { userId: 'p4', isRegistered: true },
      ],
      settlementKey: null,
    };

    // Make roster participants map to side 1
    (mockMatch.participants as any).push(
      { userId: 'p1', side: 1 },
      { userId: 'p2', side: 1 },
      { userId: 'p3', side: 1 },
      { userId: 'p4', side: 1 }
    );

    (prisma.match.findUnique as any).mockResolvedValue(mockMatch);
    (prisma.wallet.findUnique as any).mockResolvedValue({ id: 'w_any' });

    await settleMatch('match_team_4v4', 'manager_1');

    // Each winner should be credited exactly PKR 225
    expect(ledger.creditWinnings).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: 'p1',
        amount: new Prisma.Decimal(225),
      })
    );
    expect(ledger.creditWinnings).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: 'p4',
        amount: new Prisma.Decimal(225),
      })
    );
  });

  it('should be strictly idempotent and return early if settlementKey already exists', async () => {
    const mockSettledMatch = {
      id: 'match_already_settled',
      publicId: 'EG-M-DONE',
      status: 'RESULT_VERIFIED',
      result: { winnerSide: 1, loserSide: 2 },
      settlementKey: 'settle_match_already_settled',
    };

    (prisma.match.findUnique as any).mockResolvedValue(mockSettledMatch);
    const creditSpy = vi.spyOn(ledger, 'creditWinnings');
    creditSpy.mockClear();

    await settleMatch('match_already_settled', 'admin_1');

    // Should not perform any ledger or credit actions
    expect(creditSpy).not.toHaveBeenCalled();
  });
});
