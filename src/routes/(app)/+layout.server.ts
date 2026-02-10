import { requireAuth } from '$lib/server/auth';

export function load() {
  const { user, session } = requireAuth();
  return { user, session };
}
