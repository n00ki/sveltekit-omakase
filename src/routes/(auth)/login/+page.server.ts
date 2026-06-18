import { requireGuest } from '$lib/server/auth';
import { getSafeChallengeNext } from '$lib/server/security';

export function load({ url }) {
  requireGuest();

  return {
    next: getSafeChallengeNext(url.searchParams.get('next'), '/dashboard'),
    metadata: {
      title: 'Login'
    }
  };
}
