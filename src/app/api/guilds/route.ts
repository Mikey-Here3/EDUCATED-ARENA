import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { generatePublicId } from '@/lib/utils';
import { guildCreateSchema } from '@/lib/validation/schemas';
import { GuildRole } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const guilds = await prisma.guild.findMany({
      include: {
        leader: { select: { id: true, username: true, displayName: true } },
        _count: { select: { members: true } },
      },
    });
    return NextResponse.json({ data: guilds });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = guildCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: parsed.error }, { status: 400 });
    }

    const { name, description, maxCapacity } = parsed.data;

    const slug = generatePublicId('gd-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-'));

    const guild = await prisma.$transaction(async (tx) => {
      const newGuild = await tx.guild.create({
        data: {
          name,
          slug,
          description,
          leaderId: session.id,
          maxCapacity: maxCapacity || 50,
        },
      });

      // Add leader
      await tx.guildMember.create({
        data: {
          guildId: newGuild.id,
          userId: session.id,
          role: GuildRole.LEADER,
        },
      });

      return newGuild;
    });

    return NextResponse.json({ success: true, guild });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
