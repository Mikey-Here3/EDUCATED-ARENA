import { getSession } from './session';
import { checkPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { SessionUser } from '@/types';

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireRole(role: string): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== role && session.role !== 'ADMIN') {
    throw new Error('Forbidden: Insufficient role');
  }
  return session;
}

export async function requirePermission(permission: string): Promise<SessionUser> {
  const session = await requireAuth();
  if (!checkPermission(session.permissions, permission)) {
    throw new Error(`Forbidden: Missing required permission: ${permission}`);
  }
  return session;
}

export async function requireOwnership(resourceUserId: string): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.id !== resourceUserId && session.role !== 'ADMIN') {
    throw new Error('Forbidden: You do not own this resource');
  }
  return session;
}
