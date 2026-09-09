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

      if (challenge.creatorId !== session.id && session.role !== 'ADMIN') {
        throw new Error('You do not have permission to cancel this challenge');
      }

      if (challenge.status !== ChallengeStatus.OPEN) {
        throw new Error('Only open challenges can be cancelled by user');
      }

      // 1. Release reserved funds back to available balance
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
        data: {
          status: ChallengeStatus.CANCELLED,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Challenge cancelled and reserved funds released.',
    });
  } catch (error: any) {
    console.error('Cancel challenge error:', error);
    return NextResponse.json({ error: error.message || 'Failed to cancel challenge' }, { status: 400 });
  }
}
