import { redirect } from '@sveltejs/kit';

import { getChallengeMode, getSafeChallengeNext } from '$lib/server/challenge';

export async function load({ locals, url }) {
  const next = getSafeChallengeNext(url.searchParams.get('next'));

  const title = 'Confirm Access';

  if (!locals.user || !locals.session) {
    return {
      next,
      method: 'totp',
      metadata: {
        title
      }
    };
  }

  const method = await getChallengeMode();

  if (method === 'none') {
    redirect(303, next);
  }

  return {
    next,
    method,
    metadata: {
      title
    }
  };
}
