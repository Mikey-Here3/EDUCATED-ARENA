import prisma from '@/lib/db';
import { creditWinnings, createLedgerEntry, releaseFunds } from './ledger';
import { getSetting } from '@/lib/services/settings.service';
import { NotificationType, TransactionType, MatchStatus, Prisma } from '@prisma/client';

export async function settleMatch(matchId: string, actorId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const match = await tx.match.findUnique({
      where: { id: matchId },
      include: {
        participants: true,
        rosters: true,
        result: true,
      },
    });

    if (!match) throw new Error('Match not found');
    if (match.status !== MatchStatus.RESULT_VERIFIED) {
      throw new Error(`Match cannot be settled in status: ${match.status}`);
    }
    if (!match.result) {
      throw new Error('Match result not found');
    }

    const settlementKey = `settle_${match.id}`;

    // Check idempotency: if already settled, return safely
    if (match.settlementKey) {
      return;
    }

    // 4. Calculate platform fee
    const feePercentage = await getSetting<number>('finance.platform_fee_percentage');
    const prizePool = match.prizePool;
    const feeDecimal = prizePool.mul(feePercentage).div(100);
    const winnerPrize = prizePool.minus(feeDecimal);

    // 5. Get winners/losers from participants and rosters
    const winnerSide = match.result.winnerSide;
    const loserSide = match.result.loserSide || (winnerSide === 1 ? 2 : 1);

    // Get winner and loser user IDs
    // Check if rosters exist (e.g., 4v4, 2v2)
    const winningRoster = match.rosters.filter((r) => {
      const p = match.participants.find((part) => part.userId === r.userId);
      return p?.side === winnerSide && r.isRegistered;
    });

    let winners: string[] = [];
    if (winningRoster.length > 0) {
      winners = winningRoster.map((r) => r.userId);
    } else {
      winners = match.participants
        .filter((p) => p.side === winnerSide)
        .map((p) => p.userId);
    }

    const losingParticipants = match.participants.filter((p) => p.side === loserSide);
    const losers = losingParticipants.map((p) => p.userId);

    if (winners.length === 0) {
      throw new Error('No winning players found in registered roster to settle');
    }

    // Equal prize distribution among registered winners (integer PKR)
    const perWinnerPrize = winnerPrize.div(winners.length).toDecimalPlaces(0, Prisma.Decimal.ROUND_DOWN);

    // 6. Commit entry fee & Credit each winner
    for (const winnerId of winners) {
      const wallet = await tx.wallet.findUnique({ where: { userId: winnerId } });
      if (!wallet) continue;

      // Update Profile Stats
      if (tx.profile?.update) {
        await tx.profile.update({
          where: { userId: winnerId },
          data: {
            wins: { increment: 1 },
            matchesPlayed: { increment: 1 },
            totalEarnings: { increment: perWinnerPrize },
            rating: { increment: 15 }, // Simple ELO win bump
          },
        });
      }

      // Commit reserved entry fee
      await createLedgerEntry(tx, {
        walletId: wallet.id,
        userId: winnerId,
        type: TransactionType.MATCH_SETTLEMENT,
        amount: match.entryFee,
        description: `Match ${match.publicId} entry fee committed`,
        matchId: match.id,
        idempotencyKey: `commit_${match.id}_${winnerId}`,
      });

      // Credit winnings
      await creditWinnings(tx, {
        userId: winnerId,
        amount: perWinnerPrize,
        matchId: match.id,
        description: `Winnings for match ${match.publicId}`,
      });

      // Send winning notification
      await tx.notification.create({
        data: {
          userId: winnerId,
          type: NotificationType.WINNINGS_CREDITED,
          title: 'Victory! Match Prize Credited',
          message: `Congratulations! You won match ${match.publicId}. PKR ${perWinnerPrize.toFixed(0)} has been credited to your wallet.`,
          linkUrl: `/matches/${match.id}`,
        },
      });
    }

    // 7. Commit loser funds
    for (const loserId of losers) {
      const wallet = await tx.wallet.findUnique({ where: { userId: loserId } });
      if (!wallet) continue;

      // Update Profile Stats
      if (tx.profile?.update) {
        await tx.profile.update({
          where: { userId: loserId },
          data: {
            losses: { increment: 1 },
            matchesPlayed: { increment: 1 },
            rating: { decrement: 10 }, // Simple ELO loss penalty
          },
        });
      }

      const refundAmount = new Prisma.Decimal(10);
      let commitAmount = match.entryFee;

      if (match.entryFee.gte(refundAmount)) {
        commitAmount = match.entryFee.minus(refundAmount);
        
        // Refund PKR 10 to loser
        await releaseFunds(tx, {
          userId: loserId,
          amount: refundAmount,
          matchId: match.id,
          description: `Loser refund for match ${match.publicId}`,
        });
      } else if (match.entryFee.greaterThan(0)) {
        // If entry fee < 10, refund all
        await releaseFunds(tx, {
          userId: loserId,
          amount: match.entryFee,
          matchId: match.id,
          description: `Loser refund for match ${match.publicId}`,
        });
        commitAmount = new Prisma.Decimal(0);
      }

      if (commitAmount.greaterThan(0)) {
        await createLedgerEntry(tx, {
          walletId: wallet.id,
          userId: loserId,
          type: TransactionType.MATCH_SETTLEMENT,
          amount: commitAmount,
          description: `Match ${match.publicId} entry fee committed`,
          matchId: match.id,
          idempotencyKey: `commit_${match.id}_${loserId}`,
        });
      }

      // Notify loser
      await tx.notification.create({
        data: {
          userId: loserId,
          type: NotificationType.RESULT_APPROVED,
          title: 'Match Result Finalized',
          message: `Match ${match.publicId} has concluded. Thank you for competing.`,
          linkUrl: `/matches/${match.id}`,
        },
      });
    }

    // 8. Update match state and record settlement key
    await tx.match.update({
      where: { id: match.id },
      data: {
        status: MatchStatus.COMPLETED,
        settlementKey,
        settledAt: new Date(),
        completedAt: new Date(),
        platformFee: feeDecimal,
      },
    });

    // 9. Log audit
    await tx.auditLog.create({
      data: {
        actorId,
        action: 'MATCH_SETTLED',
        targetType: 'MATCH',
        targetId: match.id,
        metadata: {
          prizePool: prizePool.toNumber(),
          platformFee: feeDecimal.toNumber(),
          winnerPrize: winnerPrize.toNumber(),
          perWinnerPrize: perWinnerPrize.toNumber(),
          winnerCount: winners.length,
          winners,
          losers,
        },
      },
    });
  });
}
