import { requireTwoFactor } from '$lib/server/access';
import { requireAuth } from '$lib/server/auth';

export async function load({ url }) {
  const { user, session } = requireAuth();
  await requireTwoFactor(`${url.pathname}${url.search}`);

  return { user, session };
}
