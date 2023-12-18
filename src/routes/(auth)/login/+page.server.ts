// Types
import type { Action, Actions } from './$types';

// Utils
import { auth } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/validations/auth';
import { setFormFail, setFormError } from '$lib/utils/helpers/forms';
import { LuciaError } from 'lucia';

export async function load({ locals }) {
  // redirect to `/` if logged in
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');

  const form = await superValidate(loginSchema);

  return {
    metadata: {
      title: 'Login'
    },
    form
  };
}

const login: Action = async (event) => {
  const form = await superValidate(event.request, loginSchema);

  if (!form.valid) {
    return setFormFail(form, { removeSensitiveData: ['password'] });
  } else {
    const { password, email } = form.data;

    try {
      const key = await auth.useKey('email', email.toLowerCase(), password);
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {}
      });
      event.locals.auth.setSession(session);
    } catch (e: any) {
      if (
        (e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') ||
        e.message === 'AUTH_INVALID_PASSWORD'
      ) {
        return setFormError(
          form,
          'Incorrect email or password',
          {
            status: 401,
            removeSensitiveData: ['password']
          },
          event
        );
      }

      return setFormError(
        form,
        'Something went wrong. Please try again later.',
        {
          status: 500,
          removeSensitiveData: ['password']
        },
        event
      );
    }
  }

  throw redirect(
    '/',
    {
      type: 'success',
      message: 'Logged in successfully'
    },
    event
  );
};

export const actions: Actions = { login };
