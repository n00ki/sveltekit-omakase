import { load as loadFlash } from 'sveltekit-flash-message/server';

import { auth } from '$lib/server/auth';

export async function load(event) {
  const session = await auth.api.getSession(event.request);
  return {
    ...loadFlash(event),
    user: session?.user ?? null,
    session: session?.session ?? null
  };
}
