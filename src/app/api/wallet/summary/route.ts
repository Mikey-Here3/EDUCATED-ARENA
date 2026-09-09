import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.id },
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Pending deposits & withdrawals count and sums
    const [pendingDeposits, pendingWithdrawals] = await Promise.all([
      prisma.deposit.aggregate({
        where: { userId: session.id, status: 'PENDING' },
        _sum: { amount: true },
      }),
      prisma.withdrawal.aggregate({
        where: { userId: session.id, status: 'PENDING' },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      available: wallet.availableBalance.toNumber(),
      reserved: wallet.reservedBalance.toNumber(),
      pending: (pendingDeposits._sum.amount?.toNumber() || 0) + (pendingWithdrawals._sum.amount?.toNumber() || 0),
      totalWinnings: wallet.totalWinnings.toNumber(),
      totalDeposits: wallet.totalDeposits.toNumber(),
      totalWithdrawals: wallet.totalWithdrawals.toNumber(),
      lifetimeEarnings: wallet.totalWinnings.toNumber(),
      currency: wallet.currency,
    });
  } catch (error: any) {
    console.error('Wallet summary error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet summary' }, { status: 500 });
  }
}
