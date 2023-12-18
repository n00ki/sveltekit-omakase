import { auth } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';

export const load = async () => {
  throw redirect(302, '/');
};

export const actions = {
  default: async (event) => {
    const session = await event.locals.auth.validate();
    if (!session) throw redirect(302, '/');

    await auth.invalidateSession(session.sessionId); // invalidate session
    event.locals.auth.setSession(null); // remove cookie

    throw redirect(
      '/',
      {
        type: 'success',
        message: 'Logged out successfully'
      },
      event
    );
  }
};
