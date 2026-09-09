import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth/guard';

export async function GET(req: NextRequest) {
  try {
    await requireRole('MANAGER');

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where = status ? { status: status as any } : {};

    const [deposits, total] = await Promise.all([
      prisma.deposit.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, displayName: true },
          },
          reviewedBy: {
            select: { id: true, username: true, displayName: true },
          },
          screenshot: true,
        },
      }),
      prisma.deposit.count({ where }),
    ]);

    return NextResponse.json({
      data: deposits,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Fetch deposits error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}
