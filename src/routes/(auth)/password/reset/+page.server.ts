// Types
import type { Action, Actions } from './$types';

// Utils
import { auth, redirectIfLoggedIn } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { setFormError, setFormFail } from '$lib/utils/helpers/forms';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import * as m from '$lib/utils/messages.json';

// Schemas
import { passwordResetSchema } from '$lib/validations/auth';

export async function load(event) {
  redirectIfLoggedIn();

  const token = event.url.searchParams.get('token');
  const email = event.url.searchParams.get('email');
  const error = event.url.searchParams.get('error');

  if (error || !token || !email) {
    if (error) console.log(`Password Reset Error: ${error}`);

    redirect(
      '/password',
      {
        type: 'error',
        message: m.auth.resetPassword.invalidToken
      },
      event
    );
  } else {
    const form = await superValidate({ email, token }, zod4(passwordResetSchema), {
      errors: false
    });

    return {
      metadata: {
        title: 'Password Reset'
      },
      form
    };
  }
}

const resetPassword: Action = async (event) => {
  const form = await superValidate(event.request, zod4(passwordResetSchema));

  if (!form.valid) {
    return setFormFail(form);
  }

  const { token, password, passwordConfirmation } = form.data;

  if (password !== passwordConfirmation) {
    return setFormError(
      form,
      m.auth.register.passwordsMismatch,
      {
        field: 'passwordConfirmation',
        removeSensitiveData: ['password', 'passwordConfirmation']
      },
      event
    );
  }

  try {
    await auth.api.resetPassword({ body: { newPassword: password, token } });
  } catch (error) {
    console.log(error);
    return setFormError(form, m.general.error, {
      status: 500
    });
  }

  redirect(
    '/login',
    {
      type: 'success',
      message: m.auth.resetPassword.success
    },
    event
  );
};

export const actions = {
  default: resetPassword
} satisfies Actions;
