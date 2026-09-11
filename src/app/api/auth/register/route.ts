import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword, generateToken, generateOTP } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validation/schemas';
import { rateLimit } from '@/lib/auth/rate-limit';
import { createSession } from '@/lib/auth/session';
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
      // Check if password matches existing user
      const isPasswordMatch = await verifyPassword(password, existingUser.passwordHash);

      if (isPasswordMatch) {
        // Auto-verify and log them in smoothly
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            emailVerified: true,
            lastLoginAt: new Date(),
          },
        });

        await createSession(existingUser.id);

        return NextResponse.json({
          success: true,
          loggedIn: true,
          message: `Welcome back, ${existingUser.displayName || existingUser.username}! Entering the arena...`,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            displayName: existingUser.displayName,
          },
        });
      }

      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ error: 'An account with this email already exists. Please log in with your password.' }, { status: 400 });
      }

      const suggestedTag = `${username}_${Math.floor(10 + Math.random() * 89)}`;
      return NextResponse.json({ 
        errors: { username: `Gamer tag "${username}" is already claimed. How about "${suggestedTag}"?` } 
      }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const verifyToken = generateOTP(6); // 6-digit OTP
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Database transaction: create User + Profile + Wallet + EmailVerification
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          passwordHash,
          displayName,
          phone,
          dateOfBirth: new Date(dateOfBirth),
          emailVerified: true, // Auto-verified so players can play immediately!
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
          usedAt: new Date(),
        },
      });

      return newUser;
    });

    // Auto-create active session for the player
    await createSession(user.id);

    // Send welcome email in background (non-blocking)
    sendVerificationEmail(user.email, verifyToken, user.displayName || user.username).catch((err) => {
      console.warn('[WELCOME EMAIL NOTICE] Non-fatal background email delivery error:', err?.message);
    });

    return NextResponse.json({
      success: true,
      loggedIn: true,
      message: 'Account created successfully! Welcome to Educated Gamer Arena.',
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
