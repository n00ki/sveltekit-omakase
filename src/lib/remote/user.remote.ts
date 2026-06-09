import { form, getRequestEvent } from '$app/server';

import { error, invalid } from '@sveltejs/kit';
import { hasCredentialAccountByUserId } from '$queries';
import { APIError as BetterAuthAPIError } from 'better-auth/api';

import { requireChallenge, requireTwoFactor } from '$lib/server/access';
import { auth, requireAuth } from '$lib/server/auth';
import { markChallengeCompleted } from '$lib/server/challenge';
import { flash, flashAndRedirect } from '$lib/server/flash';
import { updateCredentialPassword } from '$lib/server/password';
import { deleteUserSchema, updateUserPasswordSchema, updateUserSchema } from '$lib/validations/auth';

import * as m from '$messages';

export const updateUser = form(updateUserSchema, async ({ image, name }) => {
  requireAuth();
  await requireTwoFactor('/settings/profile');

  const { request } = getRequestEvent();

  if (!image && !name) {
    flash('warning', m.settings.userProfile.edit.noChanges);
    return;
  }

  try {
    await auth.api.updateUser({
      body: {
        ...(image && { image }),
        ...(name && { name })
      },
      headers: request.headers
    });
  } catch (err) {
    console.error('Failed to update user:', err);
    error(500, m.general.error);
  }

  flashAndRedirect('/settings/profile', 'success', m.settings.userProfile.edit.success);
});

export const updateUserPassword = form(updateUserPasswordSchema, async ({ _password }) => {
  const { user, session } = requireAuth();
  await requireTwoFactor('/settings/security');
  await requireChallenge('/settings/security');

  const hasCredential = await hasCredentialAccountByUserId(user.id);

  try {
    if (hasCredential) {
      await updateCredentialPassword(user.id, _password, session.token);
    } else {
      const { request } = getRequestEvent();

      await auth.api.setPassword({
        body: {
          newPassword: _password
        },
        headers: request.headers
      });
      await markChallengeCompleted();
    }
  } catch (err) {
    console.error('Failed to update password:', err);
    error(500, m.general.error);
  }

  const message = hasCredential
    ? m.settings.security.password.success.update
    : m.settings.security.password.success.set;

  flashAndRedirect('/settings/security', 'success', message);
});

export const deleteUser = form(deleteUserSchema, async (_data, issue) => {
  requireAuth();
  await requireTwoFactor('/settings/profile');

  const { request } = getRequestEvent();

  try {
    await auth.api.deleteUser({
      body: {},
      headers: request.headers
    });
  } catch (err) {
    if (err instanceof BetterAuthAPIError && err.body?.code === 'SESSION_EXPIRED') {
      invalid(issue._confirmation(m.settings.userProfile.delete.requiresRecentSignIn));
    }

    console.error('Failed to delete user:', err);
    error(500, m.general.error);
  }

  flashAndRedirect('/', 'success', m.settings.userProfile.delete.success);
});
