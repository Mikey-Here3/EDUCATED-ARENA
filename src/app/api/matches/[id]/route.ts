import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { settleMatch } from '@/lib/financial/settlement';
import { releaseFunds } from '@/lib/financial/ledger';
import { MatchStatus, NotificationType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id: matchId } = await params;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        category: true,
        gameMode: true,
        map: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                profile: {
                  select: {
                    rating: true,
                    freeFireUid: true,
                    inGameName: true,
                    wins: true,
                    losses: true,
                  },
                },
              },
            },
          },
        },
        rosters: true,
        schedule: true,
        room: true,
        rules: true,
        result: true,
        evidences: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const isParticipant = session ? match.participants.some((p) => p.userId === session.id) : false;
    const isManagerOrAdmin = session ? session.role === 'MANAGER' || session.role === 'ADMIN' : false;

    // Securely reveal Room ID & Password only if user is a participant or manager/admin
    const canSeeRoom = (isParticipant || isManagerOrAdmin) && match.room && match.room.isRevealed;

    return NextResponse.json({
      match: {
        id: match.id,
        publicId: match.publicId,
        format: match.format,
        platform: match.platform,
        entryFee: match.entryFee.toNumber(),
        prizePool: match.prizePool.toNumber(),
        platformFee: match.platformFee.toNumber(),
        status: match.status,
        managerId: match.managerId,
        category: match.category,
        gameMode: match.gameMode,
        map: match.map,
        participants: match.participants.map((p) => ({
          id: p.id,
          side: p.side,
          isCreator: p.isCreator,
          user: {
            id: p.user.id,
            username: p.user.username,
            displayName: p.user.displayName || p.user.username,
            rating: p.user.profile?.rating.toNumber() || 1000,
            freeFireUid: p.user.profile?.freeFireUid || '',
            inGameName: p.user.profile?.inGameName || '',
          },
        })),
        rosters: match.rosters,
        schedule: match.schedule,
        room: canSeeRoom
          ? {
              roomId: match.room?.roomId,
              roomPassword: match.room?.roomPassword,
              revealedAt: match.room?.revealedAt,
            }
          : null,
        rules: match.rules,
        result: match.result,
        canSeeRoom,
      },
    });
  } catch (error: any) {
    console.error('Match details error:', error);
    return NextResponse.json({ error: 'Failed to fetch match details' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id: matchId } = await params;
    const body = await req.json();
    const { action } = body;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { participants: true },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // 1. Claim Match
    if (action === 'claim') {
      if (session.role !== 'MANAGER' && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Manager authority required' }, { status: 403 });
      }

      await prisma.match.update({
        where: { id: matchId },
        data: {
          managerId: session.id,
          assignedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: 'Match claimed successfully' });
    }

    // 2. Schedule Match
    if (action === 'schedule') {
      if (session.role !== 'MANAGER' && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Manager authority required' }, { status: 403 });
      }

      const { scheduledDate, startTime, timezone, notes } = body;

      await prisma.$transaction([
        prisma.matchSchedule.upsert({
          where: { matchId },
          update: {
            scheduledDate: new Date(scheduledDate),
            startTime: new Date(startTime),
            timezone: timezone || 'Asia/Karachi',
            notes,
          },
          create: {
            matchId,
            scheduledDate: new Date(scheduledDate),
            startTime: new Date(startTime),
            timezone: timezone || 'Asia/Karachi',
            notes,
          },
        }),
        prisma.match.update({
          where: { id: matchId },
          data: {
            scheduledAt: new Date(startTime),
            status: MatchStatus.SCHEDULED,
          },
        }),
      ]);

      // Notify participants
      for (const p of match.participants) {
        await prisma.notification.create({
          data: {
            userId: p.userId,
            type: NotificationType.MATCH_SCHEDULED,
            title: 'Match Scheduled',
            message: `Match ${match.publicId} is scheduled for ${new Date(startTime).toLocaleString('en-PK')}. Be ready in Free Fire.`,
            linkUrl: `/dashboard/matches/${matchId}`,
          },
        });
      }

      return NextResponse.json({ success: true, message: 'Match scheduled successfully' });
    }

    // 3. Assign Room Credentials
    if (action === 'room') {
      if (session.role !== 'MANAGER' && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Manager authority required' }, { status: 403 });
      }

      const { roomId, roomPassword } = body;

      await prisma.$transaction([
        prisma.matchRoom.upsert({
          where: { matchId },
          update: {
            roomId,
            roomPassword,
            isRevealed: true,
            revealedAt: new Date(),
          },
          create: {
            matchId,
            roomId,
            roomPassword,
            createdById: session.id,
            isRevealed: true,
            revealedAt: new Date(),
          },
        }),
        prisma.match.update({
          where: { id: matchId },
          data: {
            roomId,
            roomPassword,
            status: MatchStatus.ROOM_ASSIGNED,
          },
        }),
      ]);

      // Notify participants
      for (const p of match.participants) {
        await prisma.notification.create({
          data: {
            userId: p.userId,
            type: NotificationType.ROOM_AVAILABLE,
            title: 'Custom Room Ready!',
            message: `Room credentials for match ${match.publicId} have been assigned. Enter the room now.`,
            linkUrl: `/dashboard/matches/${matchId}`,
          },
        });
      }

      return NextResponse.json({ success: true, message: 'Room assigned and revealed to players' });
    }

    // 4. Mark Match Live
    if (action === 'start') {
      if (session.role !== 'MANAGER' && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Manager authority required' }, { status: 403 });
      }

      await prisma.match.update({
        where: { id: matchId },
        data: {
          startedAt: new Date(),
          status: MatchStatus.LIVE,
        },
      });

      return NextResponse.json({ success: true, message: 'Match marked as LIVE' });
    }

    // 5. Submit Result
    if (action === 'result') {
      if (session.role !== 'MANAGER' && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Manager authority required' }, { status: 403 });
      }

      const { winnerSide, score, notes } = body;

      await prisma.$transaction([
        prisma.matchResult.upsert({
          where: { matchId },
          update: {
            winnerSide: parseInt(winnerSide, 10),
            loserSide: parseInt(winnerSide, 10) === 1 ? 2 : 1,
            score,
            notes,
            submittedById: session.id,
            submittedAt: new Date(),
          },
          create: {
            matchId,
            winnerSide: parseInt(winnerSide, 10),
            loserSide: parseInt(winnerSide, 10) === 1 ? 2 : 1,
            score,
            notes,
            submittedById: session.id,
            submittedAt: new Date(),
          },
        }),
        prisma.match.update({
          where: { id: matchId },
          data: {
            status: MatchStatus.RESULT_SUBMITTED,
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: 'Match result submitted' });
    }

    // 6. Verify Result
    if (action === 'verify') {
      if (session.role !== 'MANAGER' && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Manager authority required' }, { status: 403 });
      }

      await prisma.$transaction([
        prisma.matchResult.update({
          where: { matchId },
          data: {
            verifiedById: session.id,
            verifiedAt: new Date(),
          },
        }),
        prisma.match.update({
          where: { id: matchId },
          data: {
            status: MatchStatus.RESULT_VERIFIED,
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: 'Result verified. Ready for settlement.' });
    }

    // 7. Trigger Settlement
    if (action === 'settle') {
      if (session.role !== 'ADMIN' && session.role !== 'MANAGER') {
        return NextResponse.json({ error: 'Authority required to trigger financial settlement' }, { status: 403 });
      }

      await settleMatch(matchId, session.id);
      
      // Revalidate leaderboard to reflect new ELO/Earnings
      revalidatePath('/leaderboard');

      return NextResponse.json({ success: true, message: 'Match settled and winnings credited to winners.' });
    }

    // 8. Cancel Match & Release Reserved Funds
    if (action === 'cancel') {
      const isParticipant = match.participants.some((p) => p.userId === session.id);
      const isManagerOrAdmin = session.role === 'MANAGER' || session.role === 'ADMIN';

      if (!isParticipant && !isManagerOrAdmin) {
        return NextResponse.json({ error: 'Permission denied to cancel this match' }, { status: 403 });
      }

      if (['LIVE', 'RESULT_SUBMITTED', 'RESULT_VERIFIED', 'COMPLETED'].includes(match.status)) {
        return NextResponse.json({ error: 'Cannot cancel a match that is live or completed' }, { status: 400 });
      }

      const { reason } = body;

      await prisma.$transaction(async (tx) => {
        // Release funds for all participants
        for (const p of match.participants) {
          await releaseFunds(tx, {
            userId: p.userId,
            amount: match.entryFee.toNumber(),
            matchId: match.id,
            referenceType: 'MATCH_CANCEL',
            referenceId: match.id,
            description: `Refund PKR ${match.entryFee.toNumber()} from cancelled match ${match.publicId}`,
          });

          await tx.notification.create({
            data: {
              userId: p.userId,
              type: NotificationType.ACCOUNT_WARNING,
              title: 'Match Cancelled',
              message: `Match ${match.publicId} was cancelled. Your entry fee of PKR ${match.entryFee.toNumber()} has been returned to your wallet.`,
              linkUrl: '/dashboard/wallet',
            },
          });
        }

        await tx.match.update({
          where: { id: matchId },
          data: {
            status: MatchStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelledById: session.id,
            cancellationReason: reason || 'Cancelled by participant/referee before battle started',
          },
        });

        if (match.challengeId) {
          await tx.challenge.update({
            where: { id: match.challengeId },
            data: { status: 'CANCELLED' },
          });
        }
      });

      return NextResponse.json({ success: true, message: 'Match cancelled and entry fees refunded to players.' });
    }

    return NextResponse.json({ error: 'Invalid match action' }, { status: 400 });
  } catch (error: any) {
    console.error('Match action error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process match action' }, { status: 500 });
  }
}
