import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { TeamRole } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: teamId } = await params;
    const body = await req.json();
    const { userId, role } = body;

    const targetUserId = userId || session.id;

    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.team.findUnique({
        where: { id: teamId },
        include: { _count: { select: { members: true } } },
      });

      if (!team) throw new Error('Team not found');

      // Authorization check: Only leader, officer, or admin can add someone else
      if (targetUserId !== session.id) {
        const callerMember = await tx.teamMember.findUnique({
          where: { teamId_userId: { teamId, userId: session.id } },
        });

        const isLeader = team.leaderId === session.id;
        const isOfficer = callerMember?.role === TeamRole.OFFICER || callerMember?.role === TeamRole.ACTING_LEADER;
        const isAdmin = session.role === 'ADMIN';

        if (!isLeader && !isOfficer && !isAdmin) {
          throw new Error('Only team leaders and officers can add members to this team');
        }
      }

      // Check member cap (maximum 30 members)
      if (team._count.members >= team.maxMembers) {
        throw new Error(`Team has reached its maximum capacity of ${team.maxMembers} members`);
      }

      // Enforce 1 team per user globally
      const existingMembership = await tx.teamMember.findFirst({
        where: { userId: targetUserId }
      });

      if (existingMembership) {
        throw new Error(existingMembership.teamId === teamId 
          ? 'User is already a member of this team' 
          : 'User is already in another team. A user can only belong to one team.');
      }

      return tx.teamMember.create({
        data: {
          teamId,
          userId: targetUserId,
          role: role && session.id === team.leaderId ? role : TeamRole.MEMBER,
        },
      });
    });

    return NextResponse.json({ success: true, member: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: teamId } = await params;
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId') || session.id;

    await prisma.$transaction(async (tx) => {
      const team = await tx.team.findUnique({ where: { id: teamId } });
      if (!team) throw new Error('Team not found');

      // If removing someone else, must be leader or admin
      if (targetUserId !== session.id) {
        const isLeader = team.leaderId === session.id;
        const isAdmin = session.role === 'ADMIN';
        if (!isLeader && !isAdmin) {
          throw new Error('Only team leader or admin can remove other members');
        }
      }

      // Leader cannot leave without transferring leadership
      if (team.leaderId === targetUserId) {
        throw new Error('Team leader cannot leave. Transfer team leadership first.');
      }

      await tx.teamMember.delete({
        where: { teamId_userId: { teamId, userId: targetUserId } },
      });
    });

    return NextResponse.json({ success: true, message: 'Member removed from team' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
