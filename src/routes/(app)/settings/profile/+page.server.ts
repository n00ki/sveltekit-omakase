import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    metadata: {
      title: 'User Profile',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Profile Settings', href: '/settings/profile' }
      ]
    }
  };
};
