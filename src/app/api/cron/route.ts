/**
 * Cron / Background Jobs for Educated Gamer Arena
 *
 * Called via HTTP with CRON_SECRET authorization.
 * Every operation is idempotent.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { APP_CONFIG } from '@/config';
import { ChallengeStatus, MatchStatus } from '@prisma/client';
import { releaseFunds } from '@/lib/financial/ledger';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

async function handleCron(req: NextRequest) {
  // Authenticate cron request
  const authHeader = req.headers.get('authorization');
  const cronSecret = APP_CONFIG.cron.secret || process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid CRON_SECRET authorization' }, { status: 401 });
  }

  const results: Record<string, number> = {};

  try {
    // 1. Expire stale challenges and release creator funds
    const staleChallenges = await prisma.challenge.findMany({
      where: {
        status: ChallengeStatus.OPEN,
        expiresAt: { lt: new Date() },
      },
      select: { id: true, publicId: true, creatorId: true, entryFee: true },
    });

    let expiredCount = 0;
    for (const c of staleChallenges) {
      await prisma.$transaction(async (tx) => {
        const updated = await tx.challenge.updateMany({
          where: { id: c.id, status: ChallengeStatus.OPEN },
          data: { status: ChallengeStatus.EXPIRED },
        });

        if (updated.count > 0) {
          await releaseFunds(tx, {
            userId: c.creatorId,
            amount: c.entryFee,
            referenceType: 'CHALLENGE',
            referenceId: c.id,
            description: `Funds released from expired challenge ${c.publicId}`,
          });
          expiredCount++;
        }
      });
    }
    results.expiredChallenges = expiredCount;

    // 2. Clean up expired email verification tokens (older than 24h)
    const expiredVerifications = await prisma.emailVerification.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    results.expiredVerifications = expiredVerifications.count;

    // 3. Clean up expired password reset tokens
    const expiredResets = await prisma.passwordReset.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    results.expiredResets = expiredResets.count;

    // 4. Clean up expired sessions
    const expiredSessions = await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    results.expiredSessions = expiredSessions.count;

    // 5. Clean up old read notifications (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldNotifications = await prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: { lt: thirtyDaysAgo },
      },
    });
    results.cleanedNotifications = oldNotifications.count;

    logger.info('cron.completed', { meta: results as any });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error: any) {
    logger.error('cron.failed', { message: error.message });
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

