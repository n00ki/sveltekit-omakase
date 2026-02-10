import { form } from '$app/server';

import { error, invalid } from '@sveltejs/kit';
import { APIError as BetterAuthAPIError } from 'better-auth/api';

import { Emails, sendEmail } from '$lib/mail/mailer';
import { auth, requireGuest } from '$lib/server/auth';
import { flashAndRedirect } from '$lib/server/flash';
import { checkRateLimit } from '$lib/server/rate-limit';
import {
  createUserSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetUserPasswordSchema
} from '$lib/validations/auth';
import * as m from '$lib/messages';

export const login = form(loginSchema, async ({ email, _password }, issue) => {
  requireGuest();
  await checkRateLimit(issue.email);

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password: _password
      }
    });
  } catch (err) {
    if (err instanceof BetterAuthAPIError) {
      if (err.body?.code === 'INVALID_EMAIL_OR_PASSWORD') {
        invalid(issue.email(m.auth.login.error));
      }
    }
    error(500, m.general.error);
  }

  flashAndRedirect('/dashboard', 'success', m.auth.login.success);
});

export const createUser = form(createUserSchema, async ({ email, firstName, lastName, _password }, issue) => {
  requireGuest();
  await checkRateLimit(issue.email);

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        password: _password,
        avatar: ''
      }
    });
  } catch (err) {
    if (err instanceof BetterAuthAPIError) {
      if (err.body?.code === 'USER_ALREADY_EXISTS') {
        invalid(issue.email(m.auth.register.emailIsTaken));
      }
    }
    error(500, m.general.error);
  }

  // Send welcome email
  try {
    await sendEmail(email, Emails.Welcome, {
      userFirstName: firstName
    });
  } catch (e) {
    console.error('Failed to send welcome email:', e);
  }

  flashAndRedirect('/login', 'success', m.auth.register.success);
});

export const requestPasswordReset = form(requestPasswordResetSchema, async ({ email }, issue) => {
  requireGuest();
  await checkRateLimit(issue.email);

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `/password/reset?${new URLSearchParams({ email }).toString()}`
      }
    });
  } catch (err) {
    console.error('Password reset request failed:', err);
    // Don't expose whether email exists - always show success
  }

  // Always show success to prevent email enumeration
  flashAndRedirect('/', 'success', m.auth.requestResetPassword.success);
});

export const resetUserPassword = form(resetUserPasswordSchema, async ({ token, _password }, issue) => {
  requireGuest();

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: _password,
        token
      }
    });
  } catch (err) {
    console.error('Password reset failed:', err);
    invalid(issue.token(m.auth.resetPassword.invalidToken));
  }

  flashAndRedirect('/login', 'success', m.auth.resetPassword.success);
});
