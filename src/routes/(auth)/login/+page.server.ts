import { requireGuest } from '#lib/server/auth.ts';
import { getSafeChallengeNext } from '#lib/server/security.ts';

export function load({ url }) {
  requireGuest();

  return {
    next: getSafeChallengeNext(url.searchParams.get('next'), '/dashboard'),
    metadata: {
      title: 'Login'
    }
  };
}
