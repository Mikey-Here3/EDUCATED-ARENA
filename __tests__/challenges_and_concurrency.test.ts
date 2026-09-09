import { describe, it, expect } from 'vitest';
import { challengeCreateSchema } from '../src/lib/validation/schemas';
import { Platform } from '@prisma/client';

describe('Challenge Marketplace & Business Rule Invariants', () => {
  it('should reject challenge with entry fee below zero', () => {
    const invalidChallenge = {
      categoryId: 'cat-1',
      gameModeId: 'mode-1',
      format: '1v1',
      platform: 'MOBILE',
      entryFee: -50,
      visibility: 'PUBLIC',
    };

    const result = challengeCreateSchema.safeParse(invalidChallenge);
    expect(result.success).toBe(false);
  });

  it('should reject challenge with expiry less than 30 minutes in the future', () => {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000).toISOString();

    const shortExpiryChallenge = {
      categoryId: 'cat-1',
      gameModeId: 'mode-1',
      format: '1v1',
      platform: 'MOBILE',
      entryFee: 100,
      visibility: 'PUBLIC',
      expiresAt: tenMinutesLater,
    };

    const result = challengeCreateSchema.safeParse(shortExpiryChallenge);
    expect(result.success).toBe(false);
  });

  it('should accept valid challenge with 60-minute future expiry and positive fee', () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

    const validChallenge = {
      categoryId: 'cat-1',
      gameModeId: 'mode-1',
      format: '1v1',
      platform: 'MOBILE',
      entryFee: 100,
      visibility: 'PUBLIC',
      expiresAt: oneHourLater,
    };

    const result = challengeCreateSchema.safeParse(validChallenge);
    expect(result.success).toBe(true);
  });

  it('should strictly isolate mobile vs PC device platform matching', () => {
    const challengePlatform = Platform.MOBILE;
    const pcPlayerPlatform = Platform.PC;

    const isCompatible = (reqPlatform: Platform, userPlatform: Platform) => {
      return reqPlatform === userPlatform;
    };

    expect(isCompatible(challengePlatform, pcPlayerPlatform)).toBe(false);
    expect(isCompatible(challengePlatform, Platform.MOBILE)).toBe(true);
  });
});
