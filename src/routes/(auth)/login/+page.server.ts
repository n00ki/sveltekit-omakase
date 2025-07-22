// Types
import type { Actions, Action } from './$types';

// Utils
import { APIError as BetterAuthAPIError } from 'better-auth/api';
import { auth, redirectIfLoggedIn } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { setFormFail, setFormError, isRateLimited } from '$lib/utils/helpers/forms';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import * as m from '$lib/utils/messages.json';

// Schemas
import { loginSchema } from '$lib/validations/auth';

export async function load({ request }) {
  await redirectIfLoggedIn(request);

  const form = await superValidate(zod4(loginSchema));

  return {
    metadata: {
      title: 'Login'
    },
    form
  };
}

const login: Action = async (event) => {
  const form = await superValidate(event.request, zod4(loginSchema));

  await isRateLimited(form, event, { field: 'email', removeSensitiveData: ['password'] });

  if (!form.valid) {
    return setFormFail(form, { removeSensitiveData: ['password'] });
  }

  const { email, password } = form.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password
      },
      headers: event.request.headers
    });
  } catch (error) {
    if (error instanceof BetterAuthAPIError) {
      console.log(error);
      if (error.body?.code === 'INVALID_EMAIL_OR_PASSWORD') {
        return setFormError(
          form,
          m.auth.login.error,
          {
            field: 'email',
            removeSensitiveData: ['password', 'passwordConfirmation']
          },
          event
        );
      }
    }
    return setFormFail(form, {
      removeSensitiveData: ['password']
    });
  }

  redirect(
    '/',
    {
      status: 303,
      type: 'success',
      message: m.auth.login.success
    },
    event
  );
};

export const actions = {
  default: login
} satisfies Actions;
