import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  // redirect to `/dashboard` if logged in
  if (locals.user) redirect(302, '/dashboard');
}
