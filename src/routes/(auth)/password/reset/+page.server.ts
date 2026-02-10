import type { PageServerLoad } from './$types';

import { requireGuest } from '$lib/server/auth';
import { flashAndRedirect } from '$lib/server/flash';
import * as m from '$lib/messages';

export const load: PageServerLoad = ({ url }) => {
  requireGuest();

  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email');
  const error = url.searchParams.get('error');

  if (error || !token || !email) {
    if (error) console.error(`Password Reset Error: ${error}`);
    flashAndRedirect('/password', 'error', m.auth.resetPassword.invalidToken);
  }

  return {
    metadata: {
      title: 'Password Reset'
    },
    token,
    email
  };
};
