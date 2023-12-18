// Types
import type { Action } from './$types';

// Utils
import db from '$lib/server/database';
import { tokens } from '$lib/db/models/auth';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { resetPasswordSchema } from '$lib/validations/auth';
import { setFormFail, setFormError } from '$lib/utils/helpers/forms';

export async function load({ locals, params }) {
  // redirect user if already logged in
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');

  const emailParam: string | null = params.email || null;
  const tokenParam: string | null = params.token || null;

  if (emailParam && tokenParam) {
    try {
      const getTokens = await db
        .select({ userId: tokens.userId, expiresAt: tokens.expiresAt })
        .from(tokens)
        .where(eq(tokens.id, tokenParam));

      const token = getTokens[0];
      console.log(token);
      if (!token) {
        error(400, 'Invalid Token');
      }

      if (token.expiresAt < new Date(Date.now())) {
        error(400, 'Expired Token');
      }
    } catch (e: any) {
      error(e.status, e.body.message);
    }
  } else {
    throw redirect(302, '/reset-password');
  }

  const form = await superValidate(resetPasswordSchema);

  form.data.email = emailParam;
  form.data.token = tokenParam;

  return {
    metadata: {
      title: 'Reset Password'
    },
    form
  };
}

const reset: Action = async (event) => {
  const form = await superValidate(event.request, resetPasswordSchema);

  if (!form.valid) {
    return setFormFail(form, { removeSensitiveData: ['password', 'passwordConfirmation'] });
  } else {
    const { email, token, password, passwordConfirmation } = form.data;

    if (password !== passwordConfirmation) {
      return setFormError(
        form,
        'Passswords do not match',
        {
          status: 400,
          field: 'passwordConfirmation'
        },
        event
      );
    }
    try {
      await auth.updateKeyPassword('email', email, password);
    } catch (error) {
      return setFormError(
        form,
        'Something went wrong. Please try again later.',
        {
          status: 500,
          removeSensitiveData: ['password', 'passwordConfirmation']
        },
        event
      );
    }

    await db.delete(tokens).where(eq(tokens.id, token));
  }

  throw redirect(
    '/login',
    {
      type: 'success',
      message: 'Password was reset successfully. You can now login.'
    },
    event
  );
};

export const actions = { reset };
