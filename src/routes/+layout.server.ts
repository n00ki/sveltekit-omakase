import { loadFlash } from 'sveltekit-flash-message/server';

import { auth } from '$lib/server/auth';

export const load = loadFlash(async ({ request }) => {
  const session = await auth.api.getSession(request);
  return {
    user: session?.user ?? null,
    session: session?.session ?? null
  };
});
