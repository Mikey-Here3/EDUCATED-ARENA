import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { generatePublicId } from '@/lib/utils';
import { tournamentCreateSchema } from '@/lib/validation/schemas';
import { TournamentStatus, TournamentBracketType, Platform, Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        category: true,
        gameMode: true,
        _count: {
          select: { registrations: true, teams: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: tournaments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin authority required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = tournamentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid tournament data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const publicId = generatePublicId('EG-TRN');
    const slug = `${publicId.toLowerCase()}-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const tournament = await prisma.tournament.create({
      data: {
        publicId,
        slug,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        gameModeId: data.gameModeId,
        platform: data.platform as Platform,
        entryFee: new Prisma.Decimal(data.entryFee),
        prizePool: new Prisma.Decimal(data.prizePool),
        maxTeams: data.maxTeams,
        minTeamSize: data.minTeamSize,
        maxTeamSize: data.maxTeamSize,
        bracketType: data.bracketType as TournamentBracketType,
        registrationStartAt: new Date(data.registrationStartAt),
        registrationEndAt: new Date(data.registrationEndAt),
        startAt: new Date(data.startAt),
        status: TournamentStatus.REGISTRATION_OPEN,
        createdById: session.id,
      },
    });

    return NextResponse.json({ success: true, tournament });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
