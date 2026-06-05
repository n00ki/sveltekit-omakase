import { requireAuth } from '$lib/server/auth';

export function load() {
  requireAuth();

  return {
    metadata: {
      title: 'Appearance Settings',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Appearance Settings', href: '/settings/appearance' }
      ]
    }
  };
}
