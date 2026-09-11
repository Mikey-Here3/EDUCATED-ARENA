import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();

    if (!token && !email) {
      return NextResponse.json({ error: 'Verification token or email is required' }, { status: 400 });
    }

    let user = null;

    if (token) {
      const verification = await prisma.emailVerification.findUnique({
        where: { token: String(token).trim() },
        include: { user: true },
      });

      if (verification) {
        user = verification.user;
        await prisma.emailVerification.update({
          where: { id: verification.id },
          data: { usedAt: new Date() },
        });
      } else {
        // Fallback: check directly on user table
        user = await prisma.user.findFirst({
          where: { emailVerifyToken: String(token).trim() },
        });
      }
    }

    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email: String(email).trim().toLowerCase() },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token or user not found' },
        { status: 400 }
      );
    }

    // Mark verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null,
      },
    });

    // Create session cookie so the user is logged in immediately
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully! Welcome to the Arena.',
      redirectUrl: '/dashboard',
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
  }
}
