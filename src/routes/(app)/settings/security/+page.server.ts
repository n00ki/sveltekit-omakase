import { hasCredentialAccountByUserId, hasEnabledTwoFactorByUserId } from '$queries';

import { requireChallenge } from '$lib/server/access';

export async function load({ parent }) {
  const { user } = await parent();
  await requireChallenge('/settings/security');
  const [hasCredential, twoFactorEnabled] = await Promise.all([
    hasCredentialAccountByUserId(user.id),
    hasEnabledTwoFactorByUserId(user.id)
  ]);

  return {
    metadata: {
      title: 'Security Settings',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Security Settings', href: '/settings/security' }
      ]
    },
    hasCredentialAccount: hasCredential,
    twoFactorEnabled
  };
}
