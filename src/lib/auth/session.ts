import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { APP_CONFIG, validateProductionConfig } from '@/config';
import { SessionUser } from '@/types';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

const SESSION_COOKIE_NAME = 'ega_session';

interface JwtPayload {
  sessionId: string;
  userId: string;
}

export async function createSession(userId: string): Promise<string> {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + APP_CONFIG.auth.sessionExpiryDays);

  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: expiryDate,
      token: '',
    },
  });

  const token = jwt.sign(
    { sessionId: session.id, userId },
    APP_CONFIG.auth.secret,
    { expiresIn: `${APP_CONFIG.auth.sessionExpiryDays}d` }
  );

  await prisma.session.update({
    where: { id: session.id },
    data: { token },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: APP_CONFIG.app.env === 'production',
    sameSite: 'lax',
    expires: expiryDate,
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  validateProductionConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, APP_CONFIG.auth.secret) as JwtPayload;

    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            role: true,
            status: true,
            profileImage: {
              select: {
                path: true,
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const { user } = session;
    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      return null;
    }

    const rolePerms = ROLE_PERMISSIONS[user.role] || [];

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName || user.username,
      role: user.role as 'USER' | 'MANAGER' | 'ADMIN',
      permissions: Array.from(new Set(rolePerms)),
      profileImageUrl: user.profileImage?.path || undefined,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      const decoded = jwt.verify(token, APP_CONFIG.auth.secret) as JwtPayload;
      await prisma.session.delete({ where: { id: decoded.sessionId } }).catch(() => {});
    } catch {
      // Ignore invalid token error
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function refreshSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return;

  try {
    const decoded = jwt.verify(token, APP_CONFIG.auth.secret) as JwtPayload;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + APP_CONFIG.auth.sessionExpiryDays);

    await prisma.session.update({
      where: { id: decoded.sessionId },
      data: { expiresAt: expiryDate },
    });

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: APP_CONFIG.app.env === 'production',
      sameSite: 'lax',
      expires: expiryDate,
      path: '/',
    });
  } catch {
    // Cannot refresh invalid session
  }
}
