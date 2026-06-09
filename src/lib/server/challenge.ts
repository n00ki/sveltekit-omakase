import {
  getSessionSecurityTimestampsByToken,
  hasCredentialAccountByUserId,
  hasEnabledTwoFactorByUserId
} from '$queries';
import { eq } from 'drizzle-orm';

import { Session } from '$lib/db/models';
import { requireAuth } from '$lib/server/auth';
import db from '$lib/server/database';

import { config } from '$config/server';

export type ChallengeMode = 'none' | 'password' | 'session' | 'totp';

export function getSafeChallengeNext(value: string | null | undefined, fallback = '/settings/security'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}

function isFresh(timestamp: Date | null | undefined): boolean {
  return !!timestamp && Date.now() - timestamp.getTime() < config.security.challenge.lifetimeMs;
}

export async function hasPendingTwoFactorChallenge(): Promise<boolean> {
  const { session, user } = requireAuth();
  const [hasTwoFactor, timestamps] = await Promise.all([
    hasEnabledTwoFactorByUserId(user.id),
    getSessionSecurityTimestampsByToken(session.token)
  ]);

  return hasTwoFactor && !timestamps?.twoFactorCompletedAt;
}

export async function getChallengeMode(): Promise<ChallengeMode> {
  const { session, user } = requireAuth();
  const [hasPassword, hasTwoFactor, timestamps] = await Promise.all([
    hasCredentialAccountByUserId(user.id),
    hasEnabledTwoFactorByUserId(user.id),
    getSessionSecurityTimestampsByToken(session.token)
  ]);

  if (hasTwoFactor && !timestamps?.twoFactorCompletedAt) {
    return 'totp';
  }

  if (isFresh(timestamps?.challengeCompletedAt)) {
    return 'none';
  }

  if (hasTwoFactor) {
    return 'totp';
  }

  if (hasPassword) {
    return 'password';
  }

  return isFresh(timestamps?.createdAt) ? 'none' : 'session';
}

export async function markChallengeCompleted(sessionToken?: string): Promise<void> {
  const token = sessionToken ?? requireAuth().session.token;
  const now = new Date();

  await db
    .update(Session)
    .set({
      challengeCompletedAt: now,
      updatedAt: now
    })
    .where(eq(Session.token, token));
}

export async function markTwoFactorChallengeCompleted(sessionToken: string): Promise<void> {
  const now = new Date();

  await db
    .update(Session)
    .set({
      challengeCompletedAt: now,
      twoFactorCompletedAt: now,
      updatedAt: now
    })
    .where(eq(Session.token, sessionToken));
}
