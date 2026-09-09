import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validation/schemas';
import { rateLimit } from '@/lib/auth/rate-limit';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`register:${ip}`, 5, 3600000); // 5 per hour
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      return NextResponse.json({ errors: formattedErrors }, { status: 400 });
    }

    const { email, username, password, displayName, phone, dateOfBirth } = result.data;

    // Check unique email & username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const verifyToken = generateToken();
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Database transaction: create User + Profile + Wallet + EmailVerification in atomic step
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          passwordHash,
          displayName,
          phone,
          dateOfBirth: new Date(dateOfBirth),
          emailVerifyToken: verifyToken,
          emailVerifyExpiry: verifyExpiry,
          termsAcceptedAt: new Date(),
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          rating: 1000,
        },
      });

      await tx.wallet.create({
        data: {
          userId: newUser.id,
          currency: 'PKR',
        },
      });

      await tx.emailVerification.create({
        data: {
          userId: newUser.id,
          token: verifyToken,
          expiresAt: verifyExpiry,
        },
      });

      return newUser;
    });

    // Send verification email via provider
    await sendVerificationEmail(user.email, verifyToken, user.displayName || user.username);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      userId: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
