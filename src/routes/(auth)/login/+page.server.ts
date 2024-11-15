// Types
import type { Action, Actions } from './$types';

// Utils
import * as auth from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setFormFail, setFormError, isRateLimited } from '$lib/utils/helpers/forms';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import * as m from '$lib/utils/messages.json';

// Schemas
import { loginSchema } from '$lib/validations/auth';

// Database
import db from '$lib/server/database';
import { User } from '$models/user';

export async function load({ locals }) {
  // redirect to `/` if logged in
  if (locals.user) redirect(302, '/');

  const form = await superValidate(zod(loginSchema));

  return {
    metadata: {
      title: 'Login'
    },
    form
  };
}

const login: Action = async (event) => {
  const form = await superValidate(event.request, zod(loginSchema));

  await isRateLimited(form, event, { field: 'email', removeSensitiveData: ['password'] });

  if (!form.valid) {
    return setFormFail(form, { removeSensitiveData: ['password'] });
  } else {
    const { password, email } = form.data;

    try {
      const user = await db.query.User.findFirst({
        where: eq(User.email, email)
      });

      if (!user) {
        return setFormError(
          form,
          m.auth.login.error,
          {
            status: 401,
            field: 'email',
            removeSensitiveData: ['password']
          },
          event
        );
      }

      const validPassword = await new Argon2id().verify(user.hashedPassword!, password);

      if (!validPassword) {
        return setFormError(
          form,
          m.auth.login.error,
          {
            status: 401,
            field: 'email',
            removeSensitiveData: ['password']
          },
          event
        );
      }

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, user.id);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch {
      return setFormError(
        form,
        m.general.error,
        {
          status: 500,
          removeSensitiveData: ['password']
        },
        event
      );
    }
  }

  redirect(
    '/',
    {
      type: 'success',
      message: m.auth.login.success
    },
    event
  );
};

export const actions: Actions = { login };
