import { requireLogin } from '$lib/server/auth';

export async function load({ request }) {
  const session = await requireLogin(request);

  return {
    user: session.user,
    session: session.session
  };
}
