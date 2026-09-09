interface RateLimitInfo {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

const store = new Map<string, RateLimitInfo>();

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, info] of Array.from(store.entries())) {
    if (now > info.resetAt) {
      store.delete(key);
    }
  }
}, 60000).unref();

export function rateLimit(key: string, maxAttempts: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const info = store.get(key);

  if (!info || now > info.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: maxAttempts - 1, resetAt };
  }

  if (info.count >= maxAttempts) {
    return { success: false, remaining: 0, resetAt: info.resetAt };
  }

  info.count += 1;
  store.set(key, info);
  
  return { 
    success: true, 
    remaining: maxAttempts - info.count, 
    resetAt: info.resetAt 
  };
}
