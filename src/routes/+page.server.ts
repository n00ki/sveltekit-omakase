import { redirectIfLoggedIn } from '$lib/server/auth';

export async function load({ request }) {
  await redirectIfLoggedIn(request);
}
