import type { RequestEvent } from '@sveltejs/kit';

import { auth } from '$lib/server/auth';
import { getSafeChallengeNext } from '$lib/server/security';

export async function GET({ url }: RequestEvent) {
  const callbackURL = getSafeChallengeNext(url.searchParams.get('next'), '/dashboard');

  try {
    const response = await auth.api.signInSocial({
      body: {
        provider: 'google',
        callbackURL
      }
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: response.url?.toString() ?? '/login'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 500,
      headers: {
        Location: '/login'
      }
    });
  }
}
