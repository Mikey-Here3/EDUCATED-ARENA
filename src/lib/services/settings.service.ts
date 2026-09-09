import prisma from '@/lib/db';
import { AppSetting } from '@/types';

export const DEFAULT_SETTINGS: Record<string, any> = {
  'platform.name': 'Educated Gamer Arena',
  'platform.currency': 'PKR',
  'finance.minimum_deposit': 50,
  'finance.minimum_withdrawal': 200,
  'finance.platform_fee_percentage': 10,
  'match.default_expiry_minutes': 1440, // 24 hours
  'match.minimum_expiry_minutes': 30,
  'match.no_show_timeout_minutes': 15,
  'match.cancellation_fee_percentage': 0,
  'leaderboard.rating_initial': 1000,
  'leaderboard.rating_k_factor': 32,
};

let cachedSettings: Map<string, AppSetting> | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function refreshCache() {
  const dbSettings = await prisma.appSetting.findMany();
  cachedSettings = new Map();

  dbSettings.forEach((setting: any) => {
    cachedSettings!.set(setting.key, {
      id: setting.id,
      key: setting.key,
      value: setting.value,
      category: setting.category,
      description: setting.description || undefined,
      isPublic: setting.isPublic,
      updatedAt: setting.updatedAt.toISOString(),
    });
  });

  lastCacheTime = Date.now();
}

async function ensureCache() {
  if (!cachedSettings || Date.now() - lastCacheTime > CACHE_TTL) {
    await refreshCache();
  }
}

export async function getSetting<T = any>(key: string): Promise<T> {
  await ensureCache();
  const setting = cachedSettings!.get(key);

  if (setting) {
    try {
      if (typeof setting.value === 'string') {
        return JSON.parse(setting.value) as T;
      }
      return setting.value as T;
    } catch {
      return setting.value as T;
    }
  }

  return DEFAULT_SETTINGS[key] as T;
}

export async function getSettings(category: string): Promise<AppSetting[]> {
  await ensureCache();
  return Array.from(cachedSettings!.values()).filter((s) => s.category === category);
}

export async function setSetting(
  key: string,
  value: any,
  options: { category: string; description?: string; isPublic?: boolean; updatedById?: string }
): Promise<void> {
  const jsonValue = typeof value === 'object' ? value : value;

  await prisma.appSetting.upsert({
    where: { key },
    update: {
      value: jsonValue,
      category: options.category,
      description: options.description,
      isPublic: options.isPublic ?? true,
      updatedById: options.updatedById,
    },
    create: {
      key,
      value: jsonValue,
      category: options.category,
      description: options.description,
      isPublic: options.isPublic ?? true,
      updatedById: options.updatedById,
    },
  });

  await refreshCache();
}

export async function getPublicSettings(): Promise<Record<string, any>> {
  await ensureCache();
  const publicSettings: Record<string, any> = {};

  Object.keys(DEFAULT_SETTINGS).forEach((key) => {
    publicSettings[key] = DEFAULT_SETTINGS[key];
  });

  Array.from(cachedSettings!.values())
    .filter((s) => s.isPublic)
    .forEach((setting) => {
      try {
        publicSettings[setting.key] =
          typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      } catch {
        publicSettings[setting.key] = setting.value;
      }
    });

  return publicSettings;
}
