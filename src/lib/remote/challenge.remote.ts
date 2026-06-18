import { form, getRequestEvent } from '$app/server';

import { error, invalid } from '@sveltejs/kit';
import { APIError as BetterAuthAPIError } from 'better-auth/api';

import { auth } from '$lib/server/auth';
import { flashAndRedirect } from '$lib/server/flash';
import { checkRateLimit } from '$lib/server/rate-limit';
import { getChallengeMode, getSafeChallengeNext, markChallengeCompleted } from '$lib/server/security';
import * as twoFactor from '$lib/server/two-factor';
import { passwordChallengeSchema, recoveryChallengeSchema, totpChallengeSchema } from '$lib/validations/auth';

import * as m from '$messages';

function finishTwoFactor(next: string | undefined, loggedIn: boolean) {
  flashAndRedirect(getSafeChallengeNext(next), 'success', loggedIn ? m.auth.challenge.success : m.auth.login.success);
}

function handleExpiredTwoFactor(result: string) {
  if (result === 'expired') {
    flashAndRedirect('/login', 'error', m.auth.twoFactor.expired);
  }
}

export const completeTotpChallenge = form(totpChallengeSchema, async ({ next, _code }, issue) => {
  const event = getRequestEvent();
  await checkRateLimit(issue._code);

  const result = await twoFactor.verifyTotpChallenge(_code);
  handleExpiredTwoFactor(result);

  if (result === 'invalid') {
    invalid(issue._code(m.auth.twoFactor.invalidCode));
  }
  if (result === 'failed') {
    error(500, m.general.error);
  }

  finishTwoFactor(next, !!event.locals.user);
});

export const completeRecoveryChallenge = form(recoveryChallengeSchema, async ({ next, _recoveryCode }, issue) => {
  const event = getRequestEvent();
  await checkRateLimit(issue._recoveryCode);

  const result = await twoFactor.verifyRecoveryChallenge(_recoveryCode);
  handleExpiredTwoFactor(result);

  if (result === 'invalid') {
    invalid(issue._recoveryCode(m.auth.twoFactor.invalidRecoveryCode));
  }
  if (result === 'failed') {
    error(500, m.general.error);
  }

  finishTwoFactor(next, !!event.locals.user);
});

export const completePasswordChallenge = form(passwordChallengeSchema, async ({ next, _password }, issue) => {
  const event = getRequestEvent();
  await checkRateLimit(issue._password);

  if ((await getChallengeMode()) !== 'password') {
    error(400, m.general.error);
  }

  try {
    await auth.api.verifyPassword({
      body: { password: _password },
      headers: event.request.headers
    });
  } catch (err) {
    if (err instanceof BetterAuthAPIError && err.body?.code === 'INVALID_PASSWORD') {
      invalid(issue._password(m.auth.challenge.invalidPassword));
    }

    console.error('Failed to complete password challenge:', err);
    error(500, m.general.error);
  }

  await markChallengeCompleted();
  flashAndRedirect(getSafeChallengeNext(next), 'success', m.auth.challenge.success);
});
