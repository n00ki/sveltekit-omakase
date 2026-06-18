import { getRequestEvent } from '$app/server';

import { error, redirect } from '@sveltejs/kit';
import { and, eq, isNotNull } from 'drizzle-orm';

import { Account, Session, TwoFactor, User } from '$lib/db/models';
import { requireAuth } from '$lib/server/auth';
import db from '$lib/server/database';

import * as m from '$messages';
import { config } from '$config/server';

const CHALLENGE_PATH = '/auth/challenge';
const SECURITY_PATH = '/settings/security';

export type ChallengeMode = 'none' | 'password' | 'session' | 'totp';

export type ChallengeState = {
  challengeCompletedAt: Date | null;
  hasCredentialAccount: boolean;
  sessionCreatedAt: Date | null;
  twoFactorCompletedAt: Date | null;
  twoFactorEnabled: boolean;
};

export function requirePublic(resource: { visibility: 'public' | 'private' }) {
  if (resource.visibility === 'private') {
    error(404, m.general.notFound);
  }
}

export function requireOwner(ownerId: string) {
  const { locals } = getRequestEvent();

  if (!locals.user || locals.user.id !== ownerId) {
    error(403, m.general.forbidden);
  }
}

function isFresh(timestamp: Date | null | undefined, now: Date, lifetimeMs: number) {
  return !!timestamp && now.getTime() - timestamp.getTime() < lifetimeMs;
}

export function getChallengeModeForState(
  state: ChallengeState,
  now: Date = new Date(),
  lifetimeMs: number = config.security.challenge.lifetimeMs
): ChallengeMode {
  if (state.twoFactorEnabled && !state.twoFactorCompletedAt) {
    return 'totp';
  }

  if (isFresh(state.challengeCompletedAt, now, lifetimeMs)) {
    return 'none';
  }

  if (state.twoFactorEnabled) {
    return 'totp';
  }

  if (state.hasCredentialAccount) {
    return 'password';
  }

  return isFresh(state.sessionCreatedAt, now, lifetimeMs) ? 'none' : 'session';
}

export function getSafeChallengeNext(value: string | null | undefined, fallback = SECURITY_PATH) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}

async function hasCredentialAccountByUserId(userId: string) {
  const [credentialAccount] = await db
    .select({ id: Account.id })
    .from(Account)
    .where(and(eq(Account.userId, userId), eq(Account.providerId, 'credential'), isNotNull(Account.password)))
    .limit(1);

  return !!credentialAccount;
}

async function getTwoFactorByUserId(userId: string) {
  const [twoFactor] = await db.select().from(TwoFactor).where(eq(TwoFactor.userId, userId)).limit(1);
  return twoFactor;
}

async function hasEnabledTwoFactorByUserId(userId: string) {
  const [user] = await db
    .select({ twoFactorEnabled: User.twoFactorEnabled })
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);

  if (!user?.twoFactorEnabled) {
    return false;
  }

  const [twoFactor] = await db
    .select({ id: TwoFactor.id })
    .from(TwoFactor)
    .where(and(eq(TwoFactor.userId, userId), eq(TwoFactor.verified, true)))
    .limit(1);

  return !!twoFactor;
}

async function getSessionChallengeState(sessionToken: string) {
  const [session] = await db
    .select({
      challengeCompletedAt: Session.challengeCompletedAt,
      sessionCreatedAt: Session.createdAt,
      twoFactorCompletedAt: Session.twoFactorCompletedAt
    })
    .from(Session)
    .where(eq(Session.token, sessionToken))
    .limit(1);

  return session;
}

export async function getAccountSecurityStatus(userId: string) {
  const [hasCredentialAccount, twoFactorEnabled] = await Promise.all([
    hasCredentialAccountByUserId(userId),
    hasEnabledTwoFactorByUserId(userId)
  ]);

  return { hasCredentialAccount, twoFactorEnabled };
}

async function getChallengeState(userId: string, sessionToken: string) {
  const [status, session] = await Promise.all([
    getAccountSecurityStatus(userId),
    getSessionChallengeState(sessionToken)
  ]);

  return {
    ...status,
    challengeCompletedAt: session?.challengeCompletedAt ?? null,
    sessionCreatedAt: session?.sessionCreatedAt ?? null,
    twoFactorCompletedAt: session?.twoFactorCompletedAt ?? null
  };
}

async function getCurrentChallengeContext() {
  const { session, user } = requireAuth();
  return { session, state: await getChallengeState(user.id, session.token), user };
}

function redirectToChallenge(next: string | undefined, fallback: string) {
  const { url } = getRequestEvent();
  const redirectTo = getSafeChallengeNext(next ?? `${url.pathname}${url.search}`, fallback);
  const params = new URLSearchParams({ next: redirectTo });

  redirect(303, `${CHALLENGE_PATH}?${params.toString()}`);
}

function requireFreshChallenge(state: ChallengeState, next: string) {
  if (getChallengeModeForState(state) !== 'none') {
    redirectToChallenge(next, SECURITY_PATH);
  }
}

function requireCompletedTwoFactor(state: ChallengeState, next?: string) {
  if (state.twoFactorEnabled && !state.twoFactorCompletedAt) {
    redirectToChallenge(next, '/dashboard');
  }
}

export async function getChallengeMode() {
  const { state } = await getCurrentChallengeContext();
  return getChallengeModeForState(state);
}

export async function requireChallenge(next: string) {
  const { state } = await getCurrentChallengeContext();
  requireFreshChallenge(state, next);
}

export async function requireTwoFactor(next?: string) {
  const { state } = await getCurrentChallengeContext();
  requireCompletedTwoFactor(state, next);
}

export async function requirePasswordUpdate() {
  const { session, state, user } = await getCurrentChallengeContext();
  requireCompletedTwoFactor(state, SECURITY_PATH);
  requireFreshChallenge(state, SECURITY_PATH);

  return {
    hasCredentialAccount: state.hasCredentialAccount,
    session,
    user
  };
}

export async function requireTwoFactorSetup() {
  const { state, user } = await getCurrentChallengeContext();
  requireFreshChallenge(state, SECURITY_PATH);

  if (state.twoFactorEnabled) {
    error(400, 'Two-factor authentication is already enabled.');
  }

  return { user };
}

export async function requirePendingTwoFactorSetup() {
  const { session, state, user } = await getCurrentChallengeContext();
  requireFreshChallenge(state, SECURITY_PATH);

  const twoFactor = await getTwoFactorByUserId(user.id);

  if (state.twoFactorEnabled || !twoFactor || twoFactor.verified) {
    error(400, 'Two-factor authentication setup is not available.');
  }

  return { session, twoFactor, user };
}

export async function requireEnabledTwoFactor() {
  const { session, state, user } = await getCurrentChallengeContext();
  requireFreshChallenge(state, SECURITY_PATH);

  const twoFactor = await getTwoFactorByUserId(user.id);

  if (!state.twoFactorEnabled || !twoFactor) {
    error(400, 'Two-factor authentication is not enabled.');
  }

  return { session, twoFactor, user };
}

export async function markChallengeCompleted(sessionToken?: string) {
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

export async function markTwoFactorChallengeCompleted(sessionToken: string) {
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
