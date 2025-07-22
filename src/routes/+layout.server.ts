import { auth } from '$lib/server/auth';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ request }) => {
  const session = await auth.api.getSession(request);
  return {
    user: session?.user ?? null
  };
});
