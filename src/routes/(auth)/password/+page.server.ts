import { requireGuest } from '#lib/server/auth.ts';

export function load() {
  requireGuest();

  return {
    metadata: {
      title: 'Request Password Reset'
    }
  };
}
