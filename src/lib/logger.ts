/**
 * Structured Logger for Educated Gamer Arena
 *
 * Production-safe: never logs passwords, JWT secrets, room credentials,
 * or sensitive personal information.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  event: string;
  message?: string;
  userId?: string;
  ip?: string;
  matchId?: string;
  challengeId?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

const SENSITIVE_KEYS = [
  'password', 'passwordHash', 'secret', 'token', 'roomPassword',
  'roomId', 'creditCard', 'accountNumber', 'apiKey',
];

function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      clean[key] = sanitize(value as Record<string, unknown>);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

function log(level: LogLevel, event: string, data?: Partial<Omit<LogEntry, 'level' | 'event' | 'timestamp'>>) {
  const entry: LogEntry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  if (entry.meta) {
    entry.meta = sanitize(entry.meta);
  }

  const output = JSON.stringify(entry);

  switch (level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'debug':
      if (process.env.NODE_ENV !== 'production') {
        console.debug(output);
      }
      break;
    default:
      console.log(output);
  }
}

export const logger = {
  info: (event: string, data?: Partial<Omit<LogEntry, 'level' | 'event' | 'timestamp'>>) => log('info', event, data),
  warn: (event: string, data?: Partial<Omit<LogEntry, 'level' | 'event' | 'timestamp'>>) => log('warn', event, data),
  error: (event: string, data?: Partial<Omit<LogEntry, 'level' | 'event' | 'timestamp'>>) => log('error', event, data),
  debug: (event: string, data?: Partial<Omit<LogEntry, 'level' | 'event' | 'timestamp'>>) => log('debug', event, data),

  // ── Convenience methods for common events ──
  authFailure: (reason: string, ip?: string, meta?: Record<string, unknown>) =>
    log('warn', 'auth.failure', { ip, message: reason, meta }),

  authSuccess: (userId: string, ip?: string) =>
    log('info', 'auth.success', { userId, ip }),

  financialError: (message: string, userId?: string, meta?: Record<string, unknown>) =>
    log('error', 'financial.error', { userId, message, meta }),

  settlementError: (message: string, matchId?: string, meta?: Record<string, unknown>) =>
    log('error', 'settlement.error', { matchId, message, meta }),

  uploadFailure: (message: string, userId?: string, meta?: Record<string, unknown>) =>
    log('error', 'upload.failure', { userId, message, meta }),

  matchTransition: (matchId: string, from: string, to: string, actorId?: string) =>
    log('info', 'match.transition', { matchId, message: `${from} → ${to}`, userId: actorId }),
};
