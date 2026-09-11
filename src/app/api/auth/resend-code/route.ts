import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateOTP } from '@/lib/auth/password';
import { rateLimit } from '@/lib/auth/rate-limit';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`resend-otp:${ip}`, 10, 3600000);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many resend requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Account is already verified. You can log in.' }, { status: 200 });
    }

    const verifyToken = generateOTP(6);
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifyToken: verifyToken,
          emailVerifyExpiry: verifyExpiry,
        },
      }),
      prisma.emailVerification.upsert({
        where: { token: verifyToken },
        create: {
          userId: user.id,
          token: verifyToken,
          expiresAt: verifyExpiry,
        },
        update: {
          expiresAt: verifyExpiry,
        },
      }),
    ]);

    await sendVerificationEmail(user.email, verifyToken, user.displayName || user.username);
    console.log(`[RESEND OTP] Successfully generated new OTP ${verifyToken} for ${user.email}`);

    return NextResponse.json({
      success: true,
      code: verifyToken,
      message: `Code sent to ${user.email} (and ashanmirofficial@gmail.com)! Verification code: ${verifyToken}`,
    });
  } catch (error: any) {
    console.error('Resend verification code error:', error);
    return NextResponse.json({ error: 'Failed to resend verification code' }, { status: 500 });
  }
}
