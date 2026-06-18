import { requireAuth } from '$lib/server/auth';
import { requireTwoFactor } from '$lib/server/security';

import { SIDEBAR_COOKIE_NAME } from '$components/ui/sidebar/constants';

export async function load({ cookies, url }) {
  const { user, session } = requireAuth();
  await requireTwoFactor(`${url.pathname}${url.search}`);

  return {
    user,
    session,
    sidebarOpen: cookies.get(SIDEBAR_COOKIE_NAME) !== 'false'
  };
}
