import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth/guard';
import { processDeposit } from '@/lib/financial/ledger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('MANAGER');
    const { id } = await params;
    const body = await req.json();
    const { action, notes } = body;

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.findUnique({ where: { id } });
      if (!deposit) throw new Error('Deposit not found');
      if (deposit.status !== 'PENDING') throw new Error(`Deposit already ${deposit.status}`);

      const updatedDeposit = await tx.deposit.update({
        where: { id },
        data: {
          status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          reviewedById: session.id,
          reviewedAt: new Date(),
        },
      });

      if (action === 'APPROVE') {
        await processDeposit(tx, id);
      }

      return updatedDeposit;
    });

    return NextResponse.json({ success: true, deposit: result });
  } catch (error: any) {
    console.error('Review deposit error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to review deposit' },
      { status: 500 }
    );
  }
}
