import { requireLogin } from '$lib/server/auth';

export async function load() {
  const { user, session } = requireLogin();
  return { user, session };
}
