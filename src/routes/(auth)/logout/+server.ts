import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import * as m from '$lib/utils/messages.json';

export const POST: RequestHandler = async (event) => {
  if (!event.locals.session) redirect(302, '/');

  try {
    await invalidateSession(event.locals.session.id);
    deleteSessionTokenCookie(event);
  } catch (error) {
    console.log(error);
    redirect(
      '/',
      {
        status: 500,
        type: 'error',
        message: m.general.error
      },
      event
    );
  }

  redirect(
    '/',
    {
      type: 'success',
      message: m.auth.logout.success
    },
    event
  );
};
