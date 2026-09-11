export const APP_CONFIG = {
  db: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/educated_gamer_arena?schema=public',
  },
  auth: {
    secret: process.env.AUTH_SECRET || 'fallback-secret-for-development-only-do-not-use-in-prod',
    sessionExpiryDays: parseInt(process.env.SESSION_EXPIRY_DAYS || '7', 10),
    passwordResetExpiryMinutes: 60,
    emailVerifyExpiryHours: 24,
  },
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    publicUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || 'resend',
    from: process.env.EMAIL_FROM || 'Educated Gamer Arena <noreply@studyhouse.online>',
    apiKey: process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY,
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    path: process.env.STORAGE_PATH || './uploads',
    s3: {
      bucket: process.env.STORAGE_BUCKET,
      region: process.env.STORAGE_REGION,
      accessKey: process.env.STORAGE_ACCESS_KEY,
      secretKey: process.env.STORAGE_SECRET_KEY,
      endpoint: process.env.STORAGE_ENDPOINT,
    },
  },
  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'manual',
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  cron: {
    secret: process.env.CRON_SECRET,
  },
};

// ── Production environment validation ───────────────
// Called at runtime (inside request handlers) — NOT at build time.
// This allows Vercel to build the project without env vars in the build environment.
export function validateProductionConfig(): void {
  if (process.env.NODE_ENV !== 'production') return;
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (!process.env.AUTH_SECRET) missing.push('AUTH_SECRET');
  if (!process.env.APP_URL) missing.push('APP_URL');
  if (missing.length > 0) {
    throw new Error(
      `[FATAL] Missing required production environment variables: ${missing.join(', ')}. ` +
      `Set them in Vercel Dashboard → Project Settings → Environment Variables.`
    );
  }
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length < 32) {
    console.warn('[Security Warning] AUTH_SECRET should be at least 32 characters for production.');
  }
}
