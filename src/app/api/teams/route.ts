import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { generatePublicId } from '@/lib/utils';
import { teamCreateSchema } from '@/lib/validation/schemas';
import { TeamRole } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    const teams = await prisma.team.findMany({
      where: { isActive: true },
      orderBy: { rating: 'desc' },
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profile: { select: { inGameName: true, freeFireUid: true } },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                profile: { select: { inGameName: true, freeFireUid: true } },
              },
            },
          },
          orderBy: { role: 'asc' },
        },
        _count: { select: { members: true } },
      },
    });

    let myTeam = null;
    if (session) {
      const myMembership = await prisma.teamMember.findFirst({
        where: { userId: session.id },
        include: {
          team: {
            include: {
              leader: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  profile: { select: { inGameName: true, freeFireUid: true } },
                },
              },
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      displayName: true,
                      profile: { select: { inGameName: true, freeFireUid: true } },
                    },
                  },
                },
                orderBy: { role: 'asc' },
              },
              _count: { select: { members: true } },
            },
          },
        },
      });

      if (myMembership) {
        myTeam = myMembership.team;
      }
    }

    return NextResponse.json({
      data: teams,
      myTeam,
      currentUserId: session?.id || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = teamCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: parsed.error }, { status: 400 });
    }

    const { name, description } = parsed.data;

    // Check if user is already in a team
    const existingMembership = await prisma.teamMember.findFirst({
      where: { userId: session.id }
    });

    if (existingMembership) {
      return NextResponse.json({ error: 'You are already in a team. A user can only belong to one team.' }, { status: 400 });
    }
    const slug = generatePublicId('tm-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-'));

    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name,
          slug,
          description,
          leaderId: session.id,
          maxMembers: 30, // 30-member cap
        },
      });

      // Add leader as member
      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId: session.id,
          role: TeamRole.LEADER,
        },
      });

      return newTeam;
    });

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
