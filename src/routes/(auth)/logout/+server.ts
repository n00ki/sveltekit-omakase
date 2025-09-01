import type { RequestHandler } from '@sveltejs/kit';

import { redirect } from 'sveltekit-flash-message/server';

import { auth, requireLogin } from '$lib/server/auth';
import * as m from '$lib/utils/messages.json';

export const POST: RequestHandler = async (event) => {
  requireLogin();

  try {
    await auth.api.signOut({
      headers: event.request.headers
    });
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
      status: 303,
      type: 'success',
      message: m.auth.logout.success
    },
    event
  );
};
