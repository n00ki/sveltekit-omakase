import type { Action, Actions } from './$types';

import { redirect } from 'sveltekit-flash-message/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { auth, redirectIfLoggedIn } from '$lib/server/auth';
import { isRateLimited, setFormError, setFormFail } from '$lib/utils/helpers/forms';
import * as m from '$lib/utils/messages.json';
import { requestPasswordResetSchema } from '$lib/validations/auth';

export async function load() {
  redirectIfLoggedIn();

  const form = await superValidate(zod4(requestPasswordResetSchema));

  return {
    metadata: {
      title: 'Request Password Reset'
    },
    form
  };
}

const requestPasswordReset: Action = async (event) => {
  const form = await superValidate(event.request, zod4(requestPasswordResetSchema));

  await isRateLimited(form, event, { field: 'email' });

  if (!form.valid) {
    return setFormFail(form);
  }

  const { email } = form.data;

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `/password/reset?email=${email}`
      }
    });
  } catch (error) {
    console.log(error);
    return setFormError(form, m.general.error, {
      status: 500
    });
  }

  // we send a success message even if the user doesn't exist to prevent email enumeration
  redirect(
    '/',
    {
      type: 'success',
      message: m.auth.requestResetPassword.success
    },
    event
  );
};

export const actions = {
  default: requestPasswordReset
} satisfies Actions;
