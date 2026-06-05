import type { PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import { hasCredentialAccountByUserId } from '$queries';

import { requireAuth } from '$lib/server/auth';
import { getSafeChallengeNext, hasFreshChallenge } from '$lib/server/challenge';

export const load: PageServerLoad = async ({ url }) => {
  const { user, session } = requireAuth();
  const next = getSafeChallengeNext(url.searchParams.get('next'));
  const hasCredential = await hasCredentialAccountByUserId(user.id);

  if (!hasCredential || (await hasFreshChallenge(session.token))) {
    redirect(303, next);
  }

  return {
    next,
    metadata: {
      title: 'Confirm Access'
    }
  };
};
