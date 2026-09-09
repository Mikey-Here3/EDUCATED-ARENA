import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'PLAYER';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (type === 'PLAYER') {
      const players = await prisma.profile.findMany({
        orderBy: [
          { rating: 'desc' },
          { totalEarnings: 'desc' }
        ],
        take: limit,
        include: {
          user: { select: { username: true, displayName: true } }
        }
      });
      return NextResponse.json({ data: players });
    }

    if (type === 'TEAM') {
      const teams = await prisma.team.findMany({
        orderBy: [
          { rating: 'desc' },
          { totalEarnings: 'desc' }
        ],
        take: limit,
      });
      return NextResponse.json({ data: teams });
    }

    if (type === 'GUILD') {
      const guilds = await prisma.guild.findMany({
        orderBy: [
          { rating: 'desc' },
          { matchesPlayed: 'desc' }
        ],
        take: limit,
      });
      return NextResponse.json({ data: guilds });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Fetch leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
