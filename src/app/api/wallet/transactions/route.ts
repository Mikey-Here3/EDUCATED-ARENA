import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { TransactionType, Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as TransactionType | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: Prisma.LedgerTransactionWhereInput = {
      userId: session.id,
      ...(type ? { type } : {}),
    };

    const [transactions, total, deposits, withdrawals] = await Promise.all([
      prisma.ledgerTransaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.ledgerTransaction.count({ where }),
      prisma.deposit.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.withdrawal.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const formatted = transactions.map((t) => ({
      id: t.id,
      type: t.type,
      status: t.status,
      amount: t.amount.toNumber(),
      balanceBefore: t.balanceBefore.toNumber(),
      balanceAfter: t.balanceAfter.toNumber(),
      currency: t.currency,
      description: t.description,
      createdAt: t.createdAt.toISOString(),
    }));

    const formattedDeposits = deposits.map((d) => ({
      id: d.id,
      amount: d.amount.toNumber(),
      currency: d.currency,
      method: d.method,
      transactionReference: d.transactionReference,
      status: d.status,
      reviewedAt: d.reviewedAt?.toISOString() || null,
      reviewNotes: d.reviewNotes,
      createdAt: d.createdAt.toISOString(),
    }));

    const formattedWithdrawals = withdrawals.map((w) => ({
      id: w.id,
      amount: w.amount.toNumber(),
      currency: w.currency,
      method: w.method,
      accountName: w.accountName,
      accountNumber: w.accountNumber,
      status: w.status,
      paidAt: w.paidAt?.toISOString() || null,
      userNote: w.userNote,
      reviewNotes: w.reviewNotes,
      createdAt: w.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data: formatted,
      deposits: formattedDeposits,
      withdrawals: formattedWithdrawals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error: any) {
    console.error('Wallet transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
