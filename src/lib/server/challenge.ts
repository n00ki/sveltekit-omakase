import { getRequestEvent } from '$app/server';

import { redirect } from '@sveltejs/kit';
import { hasCredentialAccountByUserId } from '$queries';
import { eq } from 'drizzle-orm';

import { Session } from '$lib/db/models';
import { requireAuth } from '$lib/server/auth';
import db from '$lib/server/database';

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const CHALLENGE_PATH = '/auth/challenge';

export function getSafeChallengeNext(value: string | null | undefined, fallback = '/settings/security'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}

export async function hasFreshChallenge(sessionToken: string): Promise<boolean> {
  const [session] = await db
    .select({ challengeCompletedAt: Session.challengeCompletedAt })
    .from(Session)
    .where(eq(Session.token, sessionToken))
    .limit(1);

  if (!session?.challengeCompletedAt) {
    return false;
  }

  return Date.now() - session.challengeCompletedAt.getTime() < CHALLENGE_TTL_MS;
}

export async function markChallengeCompleted(): Promise<void> {
  const { session } = requireAuth();

  await db
    .update(Session)
    .set({
      challengeCompletedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(Session.token, session.token));
}

/**
 * Gate password-backed sensitive work behind a recent challenge.
 * Pass the route the user should return to after confirming.
 */
export async function requireChallenge(next: string): Promise<void> {
  const { user, session } = requireAuth();
  const hasPassword = await hasCredentialAccountByUserId(user.id);

  if (!hasPassword || (await hasFreshChallenge(session.token))) {
    return;
  }

  const { url } = getRequestEvent();
  const redirectTo = getSafeChallengeNext(next || `${url.pathname}${url.search}`);
  const params = new URLSearchParams({ next: redirectTo });

  redirect(303, `${CHALLENGE_PATH}?${params.toString()}`);
}
