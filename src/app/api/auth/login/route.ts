import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { loginSchema } from '@/lib/validation/schemas';
import { rateLimit } from '@/lib/auth/rate-limit';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`login:${ip}`, 10, 900000); // 10 per 15 min
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email and password.' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: email.toLowerCase() },
        ],
        deletedAt: null,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Check account status
    if (user.status === 'BANNED') {
      return NextResponse.json(
        { error: 'Your account has been suspended or banned. Please contact support.' },
        { status: 403 }
      );
    }


    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: 'Account temporarily locked due to failed attempts. Please try again later.' },
        { status: 423 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      const newAttempts = user.loginAttempts + 1;
      const lockedUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newAttempts >= 5 ? 0 : newAttempts,
          lockedUntil,
        },
      });

      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Reset login attempts & update last login + auto-verify
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        emailVerified: true,
      },
    });

    // Create session token and set HTTP-only cookie
    const token = await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: `Internal server error during login: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
