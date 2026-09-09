import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { generatePublicId } from '@/lib/utils';
import { teamCreateSchema } from '@/lib/validation/schemas';
import { TeamRole } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const teams = await prisma.team.findMany({
      include: {
        leader: { select: { id: true, username: true, displayName: true } },
        _count: { select: { members: true } },
      },
    });
    return NextResponse.json({ data: teams });
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

    // Check if user is already in a team (if you want to enforce one team per user, otherwise allow)
    // Create team
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
