import { hasCredentialAccount } from '$remote/user.remote';

export async function load() {
  const hasCredential = await hasCredentialAccount();

  return {
    metadata: {
      title: 'Update Password',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Password Settings', href: '/settings/password' }
      ]
    },
    hasCredentialAccount: hasCredential
  };
}
