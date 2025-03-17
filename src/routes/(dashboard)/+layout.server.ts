import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  // redirect to `/` if not logged in
  if (!locals.user) redirect(302, '/');
}
