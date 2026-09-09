import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    await destroySession();
  } catch (error: any) {
    console.error('Logout session destroy error:', error);
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('ega_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}

export async function GET(req: NextRequest) {
  try {
    await destroySession();
  } catch (error: any) {
    console.error('Logout session destroy error:', error);
  }

  const loginUrl = new URL('/login', req.url);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.set('ega_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}

