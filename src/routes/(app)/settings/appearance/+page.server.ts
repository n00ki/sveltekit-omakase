import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    metadata: {
      title: 'Appearance Settings',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Appearance Settings', href: '/settings/appearance' }
      ]
    }
  };
};
