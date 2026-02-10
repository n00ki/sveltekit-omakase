import { requireGuest } from '$lib/server/auth';

export function load() {
  requireGuest();

  return {
    metadata: {
      title: 'Register'
    }
  };
}
