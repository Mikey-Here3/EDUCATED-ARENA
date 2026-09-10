import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { depositSchema } from '@/lib/validation/schemas';
import { PaymentMethodType, DepositStatus, NotificationType, Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = depositSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || 'Invalid deposit parameters';
      return NextResponse.json({ error: `Invalid deposit: ${firstIssue}`, details: parsed.error.format() }, { status: 400 });
    }

    const { amount, method, transactionReference, accountName, screenshotId } = parsed.data;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.id },
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Check duplicate reference if provided
    if (transactionReference) {
      const existing = await prisma.deposit.findFirst({
        where: {
          transactionReference,
          status: { in: [DepositStatus.PENDING, DepositStatus.APPROVED] },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A deposit with this transaction reference has already been submitted.' },
          { status: 400 }
        );
      }
    }

    const deposit = await prisma.deposit.create({
      data: {
        userId: session.id,
        walletId: wallet.id,
        amount: new Prisma.Decimal(amount),
        currency: 'PKR',
        method: method as PaymentMethodType,
        transactionReference,
        accountName,
        screenshotId,
        status: DepositStatus.PENDING,
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: session.id,
        type: NotificationType.DEPOSIT_SUBMITTED,
        title: 'Deposit Submitted',
        message: `Your deposit request of PKR ${amount} via ${method} is being reviewed by our team.`,
        linkUrl: '/dashboard/wallet',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Deposit request submitted successfully. It will be verified shortly.',
      depositId: deposit.id,
    });
  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit deposit' }, { status: 500 });
  }
}
