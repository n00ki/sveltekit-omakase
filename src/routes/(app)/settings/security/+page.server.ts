import { getAccountSecurityStatus, requireChallenge } from '$lib/server/security';

export async function load({ parent }) {
  const { user } = await parent();
  await requireChallenge('/settings/security');
  const { hasCredentialAccount, twoFactorEnabled } = await getAccountSecurityStatus(user.id);

  return {
    metadata: {
      title: 'Security Settings',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Security Settings', href: '/settings/security' }
      ]
    },
    hasCredentialAccount,
    twoFactorEnabled
  };
}
