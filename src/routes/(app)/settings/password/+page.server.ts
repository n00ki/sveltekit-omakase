import type { Action, Actions } from '@sveltejs/kit';

import { fail } from '@sveltejs/kit';
import { APIError as BetterAuthAPIError } from 'better-auth/api';
import { and, eq } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { Account } from '$lib/db/models';
import { auth } from '$lib/server/auth';
import db from '$lib/server/database';
import { setFormError } from '$lib/utils/helpers/forms';
import * as m from '$lib/utils/messages.json';
import { editPasswordSchema } from '$lib/validations/auth';

export async function load(event) {
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  if (!session) {
    redirect(302, '/login');
  }

  const credentialAccount = await db
    .select()
    .from(Account)
    .where(and(eq(Account.userId, session.user.id), eq(Account.providerId, 'credential')))
    .limit(1);

  const hasCredentialAccount = credentialAccount.length > 0;

  const form = await superValidate({ hasCredentialAccount }, zod4(editPasswordSchema), {
    errors: false
  });

  return {
    metadata: {
      title: 'Update Password',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Password Settings', href: '/settings/password' }
      ]
    },
    form,
    hasCredentialAccount
  };
}

const editPassword: Action = async (event) => {
  const form = await superValidate(event.request, zod4(editPasswordSchema));

  if (!form.valid) {
    return fail(400, { form });
  } else {
    const { hasCredentialAccount, currentPassword, password, passwordConfirmation } = form.data;

    if (password !== passwordConfirmation) {
      return setFormError(
        form,
        m.auth.register.passwordsMismatch,
        {
          field: 'passwordConfirmation',
          removeSensitiveData: ['passwordConfirmation']
        },
        event
      );
    }

    try {
      if (hasCredentialAccount && currentPassword) {
        // User has existing credential account - use changePassword (requires current password)
        await auth.api.changePassword({
          body: {
            currentPassword: currentPassword,
            newPassword: password,
            revokeOtherSessions: true
          },
          headers: event.request.headers
        });
      } else {
        // OAuth user without password - use setPassword (first time setting password)
        await auth.api.setPassword({
          body: {
            newPassword: password
          },
          headers: event.request.headers
        });
      }
    } catch (error) {
      console.log(error);
      if (hasCredentialAccount) {
        if (error instanceof BetterAuthAPIError) {
          if (error.body?.code === 'INVALID_PASSWORD') {
            return setFormError(
              form,
              'Current password is incorrect',
              {
                field: 'currentPassword',
                removeSensitiveData: ['currentPassword', 'password', 'passwordConfirmation']
              },
              event
            );
          }
        }
      } else {
        setFlash({ status: 500, type: 'error', message: m.general.error }, event);
        return fail(500, { form });
      }
    }

    if (hasCredentialAccount) {
      redirect({ type: 'success', message: m.settings.password.edit.success.update }, event);
    } else {
      redirect('/', { type: 'success', message: m.settings.password.edit.success.set }, event);
    }
  }
};

export const actions = {
  default: editPassword
} satisfies Actions;
