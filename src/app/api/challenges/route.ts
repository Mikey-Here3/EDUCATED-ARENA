import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { challengeCreateSchema } from '@/lib/validation/schemas';
import { reserveFunds } from '@/lib/financial/ledger';
import { generatePublicId } from '@/lib/utils';
import { ChallengeStatus, Platform, ChallengeVisibility, Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const format = searchParams.get('format');
    const platform = searchParams.get('platform') as Platform | null;
    const status = searchParams.get('status') as ChallengeStatus | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: Prisma.ChallengeWhereInput = {
      visibility: ChallengeVisibility.PUBLIC,
      ...(categoryId ? { categoryId } : {}),
      ...(format ? { format } : {}),
      ...(platform ? { platform } : {}),
      ...(status ? { status } : { status: ChallengeStatus.OPEN }),
    };

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              profile: {
                select: {
                  rating: true,
                  wins: true,
                  losses: true,
                  matchesPlayed: true,
                },
              },
            },
          },
          creatorTeam: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          category: {
            select: { id: true, name: true, platform: true },
          },
          gameMode: {
            select: { id: true, name: true },
          },
          map: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.challenge.count({ where }),
    ]);

    const formatted = challenges.map((c) => ({
      id: c.id,
      publicId: c.publicId,
      format: c.format,
      platform: c.platform,
      entryFee: c.entryFee.toNumber(),
      prizePool: c.prizePool.toNumber(),
      status: c.status,
      visibility: c.visibility,
      expiresAt: c.expiresAt?.toISOString(),
      createdAt: c.createdAt.toISOString(),
      category: c.category,
      gameMode: c.gameMode,
      map: c.map || undefined,
      creator: {
        id: c.creator.id,
        username: c.creator.username,
        displayName: c.creator.displayName || c.creator.username,
        rating: c.creator.profile?.rating.toNumber() || 1000,
        wins: c.creator.profile?.wins || 0,
        losses: c.creator.profile?.losses || 0,
        matchesPlayed: c.creator.profile?.matchesPlayed || 0,
      },
      creatorTeam: c.creatorTeam || undefined,
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
    console.error('Fetch challenges error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = challengeCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid challenge parameters', details: parsed.error.format() }, { status: 400 });
    }

    const {
      categoryId,
      gameModeId,
      mapId,
      mapSeriesId,
      format,
      platform,
      entryFee,
      visibility,
      expiresAt,
    } = parsed.data;

    // Check user's wallet available balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.id },
    });

    if (!wallet || wallet.availableBalance.toNumber() < entryFee) {
      return NextResponse.json(
        {
          error: `Insufficient available balance. You have PKR ${wallet?.availableBalance.toNumber() || 0}, but PKR ${entryFee} is required.`,
        },
        { status: 400 }
      );
    }

    const publicId = generatePublicId('EG-CH');
    // Calculate total prize pool (2x entry fee)
    const prizePool = entryFee * 2;

    const challenge = await prisma.$transaction(async (tx) => {
      const newChallenge = await tx.challenge.create({
        data: {
          publicId,
          creatorId: session.id,
          categoryId,
          gameModeId,
          mapId: mapId || undefined,
          mapSeriesId: mapSeriesId || undefined,
          format,
          platform: platform as Platform,
          entryFee: new Prisma.Decimal(entryFee),
          prizePool: new Prisma.Decimal(prizePool),
          visibility: (visibility as ChallengeVisibility) || ChallengeVisibility.PUBLIC,
          status: ChallengeStatus.OPEN,
          expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      // Atomically reserve funds from creator's wallet
      await reserveFunds(tx, {
        userId: session.id,
        amount: entryFee,
        matchId: newChallenge.id,
        description: `Funds reserved for challenge ${publicId}`,
      });

      return newChallenge;
    });

    return NextResponse.json({
      success: true,
      challenge: {
        id: challenge.id,
        publicId: challenge.publicId,
        entryFee,
        prizePool,
        status: challenge.status,
      },
    });
  } catch (error: any) {
    console.error('Create challenge error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create challenge' }, { status: 500 });
  }
}
