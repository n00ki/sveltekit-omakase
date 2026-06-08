import { form, getRequestEvent } from '$app/server';

import { error, invalid } from '@sveltejs/kit';
import { hasCredentialAccountByUserId } from '$queries';
import { APIError as BetterAuthAPIError } from 'better-auth/api';

import { auth, requireAuth } from '$lib/server/auth';
import { getSafeChallengeNext, markChallengeCompleted } from '$lib/server/challenge';
import { flashAndRedirect } from '$lib/server/flash';
import { checkRateLimit } from '$lib/server/rate-limit';
import { challengeSchema } from '$lib/validations/auth';

import * as m from '$messages';

export const completeChallenge = form(challengeSchema, async ({ next, _password }, issue) => {
  const { user } = requireAuth();
  await checkRateLimit(issue._password);

  const redirectTo = getSafeChallengeNext(next);

  if (!(await hasCredentialAccountByUserId(user.id))) {
    flashAndRedirect(redirectTo, 'success', m.auth.challenge.success);
  }

  const { request } = getRequestEvent();

  try {
    await auth.api.verifyPassword({
      body: {
        password: _password
      },
      headers: request.headers
    });
  } catch (err) {
    if (err instanceof BetterAuthAPIError && err.body?.code === 'INVALID_PASSWORD') {
      invalid(issue._password(m.auth.challenge.invalidPassword));
    }

    console.error('Failed to complete challenge:', err);
    error(500, m.general.error);
  }

  await markChallengeCompleted();
  flashAndRedirect(redirectTo, 'success', m.auth.challenge.success);
});
