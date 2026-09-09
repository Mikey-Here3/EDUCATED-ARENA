import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { MatchStatus, Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as MatchStatus | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let where: Prisma.MatchWhereInput = {};

    if (session) {
      if (session.role === 'USER') {
        // Find matches where user is a participant
        where = {
          participants: {
            some: { userId: session.id },
          },
          ...(status ? { status } : {}),
        };
      } else if (session.role === 'MANAGER') {
        // Matches claimed by manager or available to claim
        const scope = searchParams.get('scope');
        if (scope === 'claimed') {
          where = { managerId: session.id, ...(status ? { status } : {}) };
        } else if (scope === 'available') {
          where = { managerId: null, status: MatchStatus.MATCH_FIXED };
        } else {
          where = { ...(status ? { status } : {}) };
        }
      }
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, platform: true } },
          gameMode: { select: { id: true, name: true } },
          map: { select: { id: true, name: true } },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  profile: { select: { rating: true, freeFireUid: true, inGameName: true } },
                },
              },
            },
          },
          schedule: true,
          result: true,
        },
      }),
      prisma.match.count({ where }),
    ]);

    const formatted = matches.map((m) => ({
      id: m.id,
      publicId: m.publicId,
      format: m.format,
      platform: m.platform,
      entryFee: m.entryFee.toNumber(),
      prizePool: m.prizePool.toNumber(),
      platformFee: m.platformFee.toNumber(),
      status: m.status,
      category: m.category,
      gameMode: m.gameMode,
      map: m.map,
      participants: m.participants.map((p) => ({
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
      schedule: m.schedule
        ? {
            scheduledDate: m.schedule.scheduledDate.toISOString(),
            startTime: m.schedule.startTime.toISOString(),
            timezone: m.schedule.timezone,
            notes: m.schedule.notes,
          }
        : null,
      result: m.result
        ? {
            winnerSide: m.result.winnerSide,
            score: m.result.score,
            verifiedAt: m.result.verifiedAt?.toISOString(),
          }
        : null,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error: any) {
    console.error('Fetch matches error:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
