import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { reserveFunds, releaseFunds } from '@/lib/financial/ledger';
import { generatePublicId } from '@/lib/utils';
import { ChallengeStatus, MatchStatus, NotificationType } from '@prisma/client';

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

    // Database transaction with atomic check to strictly prevent concurrent double-acceptance
    const result = await prisma.$transaction(async (tx) => {
      const challenge = await tx.challenge.findUnique({
        where: { id: challengeId },
        include: {
          creator: true,
        },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      if (challenge.status !== ChallengeStatus.OPEN) {
        throw new Error('Challenge is no longer open for acceptance');
      }

      if (challenge.creatorId === session.id) {
        throw new Error('You cannot accept your own challenge');
      }

      // Check acceptor's profile and credentials
      const acceptorUser = await tx.user.findUnique({
        where: { id: session.id },
        include: { profile: true },
      });

      if (!acceptorUser?.profile?.freeFireUid || !acceptorUser?.phone || (!acceptorUser?.profile?.inGameName && !acceptorUser?.displayName)) {
        throw new Error('Profile incomplete! You must set your Free Fire UID, In-Game Name, and Phone Number in Settings before accepting battles.');
      }

      if (challenge.platform && acceptorUser.profile.devicePlatform !== challenge.platform) {
        throw new Error(`Platform mismatch: Challenge requires ${challenge.platform}, but your device is set to ${acceptorUser.profile.devicePlatform}.`);
      }

      // Check acceptor's wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId: session.id },
      });

      if (!wallet || wallet.availableBalance.toNumber() < challenge.entryFee.toNumber()) {
        throw new Error(
          `Insufficient available balance. You have PKR ${wallet?.availableBalance.toNumber() || 0}, but PKR ${challenge.entryFee.toNumber()} is required.`
        );
      }

      // Atomic compare-and-swap to strictly prevent concurrent double-acceptance
      const updateResult = await tx.challenge.updateMany({
        where: { id: challenge.id, status: ChallengeStatus.OPEN },
        data: {
          status: ChallengeStatus.ACCEPTED,
          acceptedById: session.id,
          acceptedAt: new Date(),
        },
      });

      if (updateResult.count === 0) {
        throw new Error('Challenge is no longer open for acceptance');
      }

      // 1. Reserve funds for opponent
      await reserveFunds(tx, {
        userId: session.id,
        amount: challenge.entryFee.toNumber(),
        referenceType: 'CHALLENGE',
        referenceId: challenge.id,
        description: `Funds reserved for match against ${challenge.creator.displayName || challenge.creator.username}`,
      });

      const matchPublicId = generatePublicId('EG-M');

      // 2. Create Match record
      const match = await tx.match.create({
        data: {
          publicId: matchPublicId,
          challengeId: challenge.id,
          categoryId: challenge.categoryId,
          gameModeId: challenge.gameModeId,
          mapId: challenge.mapId,
          mapSeriesId: challenge.mapSeriesId,
          format: challenge.format,
          platform: challenge.platform,
          entryFee: challenge.entryFee,
          prizePool: challenge.prizePool,
          status: MatchStatus.MATCH_FIXED,
        },
      });

      // 3. Create match participants (Side 1 = Creator, Side 2 = Acceptor)
      await tx.matchParticipant.createMany({
        data: [
          {
            matchId: match.id,
            userId: challenge.creatorId,
            side: 1,
            isCreator: true,
          },
          {
            matchId: match.id,
            userId: session.id,
            side: 2,
            isCreator: false,
          },
        ],
      });

      // 4. Link Match ID to Challenge
      await tx.challenge.update({
        where: { id: challenge.id },
        data: {
          matchId: match.id,
        },
      });

      // 5. Notify creator
      await tx.notification.create({
        data: {
          userId: challenge.creatorId,
          type: NotificationType.CHALLENGE_ACCEPTED,
          title: 'Challenge Accepted!',
          message: `${session.displayName} accepted your challenge ${challenge.publicId}. Match ${matchPublicId} has been created and is awaiting manager assignment.`,
          linkUrl: `/dashboard/matches/${match.id}`,
        },
      });

      // 6. Notify acceptor
      await tx.notification.create({
        data: {
          userId: session.id,
          type: NotificationType.MATCH_FIXED,
          title: 'Match Confirmed!',
          message: `You accepted challenge ${challenge.publicId}. Match ${matchPublicId} is fixed.`,
          linkUrl: `/dashboard/matches/${match.id}`,
        },
      });

      return { matchId: match.id, publicId: match.publicId };
    }, { maxWait: 10000, timeout: 20000 });

    return NextResponse.json({
      success: true,
      message: 'Challenge accepted successfully',
      matchId: result.matchId,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error('Accept challenge error:', error);
    return NextResponse.json({ error: error.message || 'Failed to accept challenge' }, { status: 400 });
  }
}
