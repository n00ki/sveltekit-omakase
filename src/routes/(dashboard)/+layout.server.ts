import { requireLogin } from '$lib/server/auth';

export async function load() {
  requireLogin();
}
