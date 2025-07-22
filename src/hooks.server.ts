// Stores
import { building } from '$app/environment';

// Utils
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
  return svelteKitHandler({ event, resolve, auth, building });
}
