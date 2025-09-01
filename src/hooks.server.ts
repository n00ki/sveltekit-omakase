import { building } from '$app/environment';

import { svelteKitHandler } from 'better-auth/svelte-kit';

import { auth } from '$lib/server/auth';

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession(event.request);
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
