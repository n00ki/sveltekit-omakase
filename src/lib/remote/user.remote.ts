import { form, getRequestEvent, query } from '$app/server';

import { error, invalid } from '@sveltejs/kit';
import { hasCredentialAccountByUserId } from '$queries';
import { APIError as BetterAuthAPIError } from 'better-auth/api';

import { auth, requireAuth } from '$lib/server/auth';
import { flash, flashAndRedirect } from '$lib/server/flash';
import { deleteUserSchema, updateUserPasswordSchema, updateUserSchema } from '$lib/validations/auth';
import * as m from '$lib/messages';

export const hasCredentialAccount = query(async () => {
  const { user } = requireAuth();
  return hasCredentialAccountByUserId(user.id);
});

export const updateUser = form(updateUserSchema, async ({ imageFileId, firstName, lastName }) => {
  const { user } = requireAuth();

  const { request } = getRequestEvent();

  if (!imageFileId && !firstName && !lastName) {
    flash('warning', m.settings.userProfile.edit.noChanges);
    return;
  }

  try {
    // Build the name from first and last name, using current values as fallback
    const updatedFirstName = firstName || user.firstName || '';
    const updatedLastName = lastName || user.lastName || '';
    const updatedName = `${updatedFirstName} ${updatedLastName}`.trim();

    await auth.api.updateUser({
      body: {
        ...(imageFileId && { avatar: imageFileId }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(updatedName && { name: updatedName })
      },
      headers: request.headers
    });
  } catch (err) {
    console.error('Failed to update user:', err);
    error(500, m.general.error);
  }

  flashAndRedirect('/settings/profile', 'success', m.settings.userProfile.edit.success);
});

export const updateUserPassword = form(updateUserPasswordSchema, async ({ _currentPassword, _password }, issue) => {
  requireAuth();

  const { request } = getRequestEvent();
  const hasCredential = await hasCredentialAccount();

  try {
    if (hasCredential) {
      // User has existing credential account - current password is required.
      if (!_currentPassword) {
        invalid(issue._currentPassword('Current password is required'));
      }

      await auth.api.changePassword({
        body: {
          currentPassword: _currentPassword,
          newPassword: _password,
          revokeOtherSessions: true
        },
        headers: request.headers
      });
    } else {
      // OAuth user without password - set password for the first time.
      await auth.api.setPassword({
        body: {
          newPassword: _password
        },
        headers: request.headers
      });
    }
  } catch (err) {
    console.error('Failed to update password:', err);
    if (hasCredential && err instanceof BetterAuthAPIError) {
      if (err.body?.code === 'INVALID_PASSWORD') {
        invalid(issue._currentPassword('Current password is incorrect'));
      }
    }
    error(500, m.general.error);
  }

  if (hasCredential) {
    flashAndRedirect('/settings/password', 'success', m.settings.password.edit.success.update);
  } else {
    flashAndRedirect('/', 'success', m.settings.password.edit.success.set);
  }
});

export const deleteUser = form(deleteUserSchema, async () => {
  requireAuth();

  const { request } = getRequestEvent();

  try {
    await auth.api.deleteUser({
      body: {},
      headers: request.headers
    });
  } catch (err) {
    console.error('Failed to delete user:', err);
    error(500, m.general.error);
  }

  flashAndRedirect('/', 'success', m.settings.userProfile.delete.success);
});
