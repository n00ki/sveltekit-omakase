// Stores
import { building } from '$app/environment';

// Utils
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession(event.request);
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
