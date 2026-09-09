import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth/guard';
import { processWithdrawal, rejectWithdrawal } from '@/lib/financial/ledger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('MANAGER');
    const { id } = await params;
    const body = await req.json();
    const { action, notes } = body;

    if (!['APPROVE', 'REJECT', 'MARK_PAID'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id } });
      if (!withdrawal) throw new Error('Withdrawal not found');

      let newStatus = withdrawal.status;

      if (action === 'APPROVE') {
        if (withdrawal.status !== 'PENDING') throw new Error(`Cannot approve from ${withdrawal.status}`);
        newStatus = 'APPROVED';
      } else if (action === 'REJECT') {
        if (withdrawal.status !== 'PENDING') throw new Error(`Cannot reject from ${withdrawal.status}`);
        newStatus = 'REJECTED';
      } else if (action === 'MARK_PAID') {
        if (withdrawal.status !== 'APPROVED' && withdrawal.status !== 'PROCESSING') {
          throw new Error(`Cannot mark paid from ${withdrawal.status}`);
        }
        newStatus = 'PAID';
      }

      const updatedWithdrawal = await tx.withdrawal.update({
        where: { id },
        data: {
          status: newStatus as any,
          reviewedById: session.id,
          reviewedAt: new Date(),
        },
      });

      if (action === 'MARK_PAID') {
        await processWithdrawal(tx, id);
      } else if (action === 'REJECT') {
        await rejectWithdrawal(tx, id);
      }

      return updatedWithdrawal;
    });

    return NextResponse.json({ success: true, withdrawal: result });
  } catch (error: any) {
    console.error('Review withdrawal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to review withdrawal' },
      { status: 500 }
    );
  }
}
