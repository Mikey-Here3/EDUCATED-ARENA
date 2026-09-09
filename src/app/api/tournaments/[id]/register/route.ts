import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { reserveFunds } from '@/lib/financial/ledger';
import { TournamentStatus, NotificationType } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: tournamentId } = await params;
    const body = await req.json().catch(() => ({}));
    const { teamId } = body;

    const registration = await prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.findUnique({
        where: { id: tournamentId },
        include: { _count: { select: { registrations: true } } },
      });

      if (!tournament) throw new Error('Tournament not found');

      if (tournament.status !== TournamentStatus.REGISTRATION_OPEN) {
        throw new Error('Tournament registration is not open');
      }

      if (tournament._count.registrations >= tournament.maxTeams) {
        throw new Error('Tournament is fully booked');
      }

      // If teamId is specified, verify session user is team leader
      if (teamId) {
        const team = await tx.team.findUnique({ where: { id: teamId } });
        if (!team || team.leaderId !== session.id) {
          throw new Error('Only the team leader can register the team');
        }

        const existingTeamReg = await tx.tournamentRegistration.findUnique({
          where: { tournamentId_teamId: { tournamentId, teamId } },
        });
        if (existingTeamReg) throw new Error('Team is already registered in this tournament');
      } else {
        const existingUserReg = await tx.tournamentRegistration.findUnique({
          where: { tournamentId_userId: { tournamentId, userId: session.id } },
        });
        if (existingUserReg) throw new Error('You are already registered in this tournament');
      }

      // Check and reserve entry fee if required
      if (tournament.entryFee.greaterThan(0)) {
        const wallet = await tx.wallet.findUnique({ where: { userId: session.id } });
        if (!wallet || wallet.availableBalance.lessThan(tournament.entryFee)) {
          throw new Error(`Insufficient wallet balance. PKR ${tournament.entryFee} entry fee required.`);
        }

        await reserveFunds(tx, {
          userId: session.id,
          amount: tournament.entryFee,
          referenceType: 'TOURNAMENT',
          referenceId: tournament.id,
          description: `Entry fee reserved for tournament ${tournament.name}`,
        });
      }

      const newReg = await tx.tournamentRegistration.create({
        data: {
          tournamentId,
          userId: teamId ? undefined : session.id,
          teamId: teamId || undefined,
          status: 'REGISTERED',
        },
      });

      // Also create TournamentTeam entry
      await tx.tournamentTeam.create({
        data: {
          tournamentId,
          registrationId: newReg.id,
          teamId: teamId || undefined,
          name: teamId ? (await tx.team.findUnique({ where: { id: teamId } }))?.name || 'Team' : session.displayName,
        },
      });

      // Notification
      await tx.notification.create({
        data: {
          userId: session.id,
          type: NotificationType.TOURNAMENT_ANNOUNCEMENT,
          title: 'Tournament Registration Confirmed',
          message: `Successfully registered for ${tournament.name}!`,
          linkUrl: `/tournaments`,
        },
      });

      return newReg;
    });

    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
