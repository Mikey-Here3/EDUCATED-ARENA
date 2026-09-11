import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { releaseFunds } from '@/lib/financial/ledger';
import { ChallengeStatus } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id: challengeId } = await params;

    await prisma.$transaction(async (tx) => {
      const challenge = await tx.challenge.findUnique({
        where: { id: challengeId },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      const isCreator = challenge.creatorId === session.id;
      const isAcceptor = challenge.acceptedById === session.id;
      const isAdmin = session.role === 'ADMIN';

      if (!isCreator && !isAcceptor && !isAdmin) {
        throw new Error('You do not have permission to cancel this challenge');
      }

      if (challenge.status === ChallengeStatus.CANCELLED) {
        return; // Already cancelled
      }

      if (challenge.status === ChallengeStatus.COMPLETED) {
        throw new Error('Cannot cancel a completed challenge');
      }

      if (challenge.status === ChallengeStatus.OPEN) {
        // 1. Release creator's reserved funds
        await releaseFunds(tx, {
          userId: challenge.creatorId,
          amount: challenge.entryFee.toNumber(),
          referenceType: 'CHALLENGE',
          referenceId: challenge.id,
          description: `Funds released from cancelled challenge ${challenge.publicId}`,
        });

        // 2. Mark challenge as cancelled
        await tx.challenge.update({
          where: { id: challenge.id },
          data: { status: ChallengeStatus.CANCELLED },
        });
      } else if (challenge.status === ChallengeStatus.ACCEPTED) {
        // Find associated match
        const match = await tx.match.findFirst({
          where: {
            OR: [
              { id: challenge.matchId || '' },
              { challengeId: challenge.id },
            ],
          },
          include: { participants: true },
        });

        if (match) {
          // Verify match hasn't started or completed
          if (['LIVE', 'RESULT_SUBMITTED', 'RESULT_VERIFIED', 'COMPLETED'].includes(match.status)) {
            throw new Error('Match is already in progress or completed and cannot be cancelled directly.');
          }

          // Release reserved funds for all participants
          for (const p of match.participants) {
            await releaseFunds(tx, {
              userId: p.userId,
              amount: match.entryFee.toNumber(),
              matchId: match.id,
              referenceType: 'MATCH_CANCEL',
              referenceId: match.id,
              description: `Refund PKR ${match.entryFee.toNumber()} from cancelled match ${match.publicId}`,
            });
          }

          // Mark match as cancelled
          await tx.match.update({
            where: { id: match.id },
            data: {
              status: 'CANCELLED',
              cancelledAt: new Date(),
              cancellationReason: `Cancelled by ${isCreator ? 'creator' : 'opponent'} before battle started`,
            },
          });
        } else {
          // No match record, refund both creator and acceptor if funds were reserved
          await releaseFunds(tx, {
            userId: challenge.creatorId,
            amount: challenge.entryFee.toNumber(),
            referenceType: 'CHALLENGE',
            referenceId: challenge.id,
            description: `Refund PKR ${challenge.entryFee.toNumber()} from cancelled challenge ${challenge.publicId}`,
          });

          if (challenge.acceptedById) {
            await releaseFunds(tx, {
              userId: challenge.acceptedById,
              amount: challenge.entryFee.toNumber(),
              referenceType: 'CHALLENGE',
              referenceId: challenge.id,
              description: `Refund PKR ${challenge.entryFee.toNumber()} from cancelled challenge ${challenge.publicId}`,
            });
          }
        }

        // Mark challenge as cancelled
        await tx.challenge.update({
          where: { id: challenge.id },
          data: { status: ChallengeStatus.CANCELLED },
        });
      } else {
        throw new Error(`Challenge in status ${challenge.status} cannot be cancelled`);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Challenge cancelled and reserved funds safely refunded to your wallet.',
    });
  } catch (error: any) {
    console.error('Cancel challenge error:', error);
    return NextResponse.json({ error: error.message || 'Failed to cancel challenge' }, { status: 400 });
  }
}
