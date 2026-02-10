import { requireGuest } from '$lib/server/auth';

export function load() {
  requireGuest();
}
