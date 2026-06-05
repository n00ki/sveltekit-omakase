import type { PageServerLoad } from './$types';

import { hasCredentialAccountByUserId } from '$queries';

import { requireChallenge } from '$lib/server/challenge';

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();
  const hasCredential = await hasCredentialAccountByUserId(user.id);

  if (hasCredential) {
    await requireChallenge('/settings/security');
  }

  return {
    metadata: {
      title: 'Security Settings',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Security Settings', href: '/settings/security' }
      ]
    },
    hasCredentialAccount: hasCredential
  };
};
