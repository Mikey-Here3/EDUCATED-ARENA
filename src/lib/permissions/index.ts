import prisma from '@/lib/db';

export const PERMISSIONS = {
  USERS: {
    VIEW: 'users.view',
    EDIT: 'users.edit',
    BAN: 'users.ban',
  },
  MATCHES: {
    VIEW: 'matches.view',
    CREATE: 'matches.create',
    ASSIGN: 'matches.assign',
    CLAIM: 'matches.claim',
    SCHEDULE: 'matches.schedule',
    CANCEL: 'matches.cancel',
    VERIFY: 'matches.verify',
    OVERRIDE: 'matches.override',
  },
  WALLET: {
    VIEW: 'wallet.view',
    DEPOSIT_REVIEW: 'wallet.deposit_review',
    WITHDRAW_REVIEW: 'wallet.withdraw_review',
    ADJUST: 'wallet.adjust',
    SETTLE: 'wallet.settle',
  },
  TOURNAMENTS: {
    VIEW: 'tournaments.view',
    CREATE: 'tournaments.create',
    MANAGE: 'tournaments.manage',
  },
  RULES: {
    CREATE: 'rules.create',
    EDIT: 'rules.edit',
  },
  PLATFORM: {
    MAPS_MANAGE: 'maps.manage',
    GAME_MODES_MANAGE: 'game_modes.manage',
  },
  MANAGERS: {
    VIEW: 'managers.view',
    CREATE: 'managers.create',
    EDIT: 'managers.edit',
    DISABLE: 'managers.disable',
  },
  SYSTEM: {
    SETTINGS_MANAGE: 'settings.manage',
    ANALYTICS_VIEW: 'analytics.view',
    AUDIT_VIEW: 'audit.view',
  },
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  USER: [
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.MATCHES.VIEW,
    PERMISSIONS.MATCHES.CREATE,
    PERMISSIONS.MATCHES.CLAIM,
    PERMISSIONS.MATCHES.SCHEDULE,
    PERMISSIONS.MATCHES.CANCEL,
    PERMISSIONS.WALLET.VIEW,
    PERMISSIONS.TOURNAMENTS.VIEW,
  ],
  MANAGER: [
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.MATCHES.VIEW,
    PERMISSIONS.MATCHES.ASSIGN,
    PERMISSIONS.MATCHES.CLAIM,
    PERMISSIONS.MATCHES.SCHEDULE,
    PERMISSIONS.MATCHES.CANCEL,
    PERMISSIONS.MATCHES.VERIFY,
    PERMISSIONS.MATCHES.OVERRIDE,
    PERMISSIONS.WALLET.VIEW,
    PERMISSIONS.WALLET.DEPOSIT_REVIEW,
    PERMISSIONS.WALLET.WITHDRAW_REVIEW,
    PERMISSIONS.TOURNAMENTS.VIEW,
    PERMISSIONS.TOURNAMENTS.MANAGE,
    PERMISSIONS.RULES.CREATE,
    PERMISSIONS.RULES.EDIT,
    PERMISSIONS.PLATFORM.MAPS_MANAGE,
    PERMISSIONS.PLATFORM.GAME_MODES_MANAGE,
    PERMISSIONS.SYSTEM.ANALYTICS_VIEW,
  ],
  ADMIN: [
    ...Object.values(PERMISSIONS).flatMap((group) => Object.values(group)),
  ],
};

export function checkPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(required);
}

export function checkAnyPermission(userPermissions: string[], required: string[]): boolean {
  return required.some((perm) => userPermissions.includes(perm));
}

export function checkAllPermissions(userPermissions: string[], required: string[]): boolean {
  return required.every((perm) => userPermissions.includes(perm));
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return [];

  const rolePerms = ROLE_PERMISSIONS[user.role] || [];
  return Array.from(new Set(rolePerms));
}

export function requirePermission(userPermissions: string[], required: string): void {
  if (!checkPermission(userPermissions, required)) {
    throw new Error(`Unauthorized: Missing required permission ${required}`);
  }
}
