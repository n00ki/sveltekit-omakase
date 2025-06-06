// Types
import type { Action } from './$types';

// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { error } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { setFormFail, setFormError } from '$lib/utils/helpers/forms';
import { eq } from 'drizzle-orm';
import { hashPassword } from '$lib/utils/helpers/password';
import * as m from '$lib/utils/messages.json';

// Scehmas
import { resetPasswordSchema } from '$lib/validations/auth';

// Database
import db from '$lib/server/database';
import { User } from '$models/user';
import { Token } from '$models/token';

export async function load({ locals, url }) {
  // redirect user if already logged in
  if (locals.user) redirect(302, '/');

  const userPublicIdParam: string | null = url.searchParams.get('user') || null;
  const tokenParam: string | null = url.searchParams.get('token') || null;
  let email: string | null = null;

  if (userPublicIdParam && tokenParam) {
    try {
      const token = await db.query.Token.findFirst({
        where: eq(Token.key, tokenParam),
        columns: {
          expiresAt: true
        },
        with: {
          user: {
            columns: {
              id: true,
              email: true
            }
          }
        }
      });

      if (!token) {
        error(400, 'Invalid Token');
      }

      if (token.expiresAt < Date.now()) {
        error(400, 'Expired Token');
      }

      email = token.user?.email ?? null;
    } catch {
      error(500, m.general.error);
    }
  } else {
    redirect(302, '/reset-password');
  }

  const form = await superValidate({ email: email ?? '', token: tokenParam }, zod(resetPasswordSchema), {
    errors: false
  });

  return {
    metadata: {
      title: 'Reset Password'
    },
    form
  };
}

const reset: Action = async (event) => {
  const form = await superValidate(event.request, zod(resetPasswordSchema));

  if (!form.valid) {
    return setFormFail(form, {
      removeSensitiveData: ['password', 'passwordConfirmation']
    });
  } else {
    const { email, token, password, passwordConfirmation } = form.data;

    if (password !== passwordConfirmation) {
      return setFormError(
        form,
        m.auth.resetPassword.passwordsMismatch,
        {
          status: 400,
          field: 'passwordConfirmation'
        },
        event
      );
    }
    try {
      await db
        .update(User)
        .set({
          hashedPassword: await hashPassword(password)
        })
        .where(eq(User.email, email));
    } catch {
      return setFormError(
        form,
        m.general.error,
        {
          status: 500,
          removeSensitiveData: ['password', 'passwordConfirmation']
        },
        event
      );
    }

    await db.delete(Token).where(eq(Token.key, token));
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

export const actions = { reset };
