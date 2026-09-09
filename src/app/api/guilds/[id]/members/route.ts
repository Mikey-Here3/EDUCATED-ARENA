import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { GuildRole } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: guildId } = await params;
    const body = await req.json();
    const { userId, role } = body;
    const targetUserId = userId || session.id;

    const result = await prisma.$transaction(async (tx) => {
      const guild = await tx.guild.findUnique({
        where: { id: guildId },
        include: { _count: { select: { members: true } } },
      });

      if (!guild) throw new Error('Guild not found');

      // Authorization check: Only leader or officer or admin can add someone else
      if (targetUserId !== session.id) {
        const callerMember = await tx.guildMember.findUnique({
          where: { guildId_userId: { guildId, userId: session.id } },
        });

        const isLeader = guild.leaderId === session.id;
        const isOfficer = callerMember?.role === GuildRole.OFFICER || callerMember?.role === GuildRole.ACTING_LEADER;
        const isAdmin = session.role === 'ADMIN';

        if (!isLeader && !isOfficer && !isAdmin) {
          throw new Error('Only guild leaders and officers can add members to this guild');
        }
      }

      if (guild._count.members >= guild.maxCapacity) {
        throw new Error(`Guild has reached its maximum capacity of ${guild.maxCapacity} members`);
      }

      const existing = await tx.guildMember.findUnique({
        where: { guildId_userId: { guildId, userId: targetUserId } },
      });

      if (existing) throw new Error('User is already a member of this guild');

      return tx.guildMember.create({
        data: {
          guildId,
          userId: targetUserId,
          role: role && session.id === guild.leaderId ? role : GuildRole.MEMBER,
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

    const { id: guildId } = await params;
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId') || session.id;

    await prisma.$transaction(async (tx) => {
      const guild = await tx.guild.findUnique({ where: { id: guildId } });
      if (!guild) throw new Error('Guild not found');

      if (targetUserId !== session.id) {
        const isLeader = guild.leaderId === session.id;
        const isAdmin = session.role === 'ADMIN';
        if (!isLeader && !isAdmin) {
          throw new Error('Only guild leader or admin can remove other members');
        }
      }

      if (guild.leaderId === targetUserId) {
        throw new Error('Guild leader cannot leave. Transfer guild leadership first.');
      }

      await tx.guildMember.delete({
        where: { guildId_userId: { guildId, userId: targetUserId } },
      });
    });

    return NextResponse.json({ success: true, message: 'Member removed from guild' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
