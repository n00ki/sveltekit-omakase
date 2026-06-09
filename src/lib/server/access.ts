import { getRequestEvent } from '$app/server';

import { error, redirect } from '@sveltejs/kit';

import { getChallengeMode, getSafeChallengeNext, hasPendingTwoFactorChallenge } from '$lib/server/challenge';

import * as m from '$messages';

type VisibilityResource = {
  visibility: 'public' | 'private';
};

const CHALLENGE_PATH = '/auth/challenge';

/**
 * Throws 404 if resource is private.
 * Use for resources that must be publicly visible.
 */
export function requirePublic(resource: VisibilityResource): void {
  if (resource.visibility === 'private') {
    error(404, m.general.notFound);
  }
}

/**
 * Throws 403 if user doesn't own the resource.
 * Use for actions that require ownership (update, delete).
 */
export function requireOwner(ownerId: string): void {
  const { locals } = getRequestEvent();

  if (!locals.user || locals.user.id !== ownerId) {
    error(403, m.general.forbidden);
  }
}

function redirectToChallenge(next: string | undefined, fallback = '/settings/security'): void {
  const { url } = getRequestEvent();
  const redirectTo = getSafeChallengeNext(next ?? `${url.pathname}${url.search}`, fallback);
  const params = new URLSearchParams({ next: redirectTo });

  redirect(303, `${CHALLENGE_PATH}?${params.toString()}`);
}

/**
 * Redirects unless the current session is fresh enough for sensitive account operations.
 */
export async function requireChallenge(next: string): Promise<void> {
  if ((await getChallengeMode()) === 'none') {
    return;
  }

  redirectToChallenge(next);
}

/**
 * Redirects 2FA-enabled users until the current session has completed a second factor.
 */
export async function requireTwoFactor(next?: string): Promise<void> {
  if (await hasPendingTwoFactorChallenge()) {
    redirectToChallenge(next, '/dashboard');
  }
}
