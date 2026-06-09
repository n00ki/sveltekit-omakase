import { form, query } from '$app/server';

import { invalid } from '@sveltejs/kit';

import { flashAndRedirect } from '$lib/server/flash';
import { checkRateLimit } from '$lib/server/rate-limit';
import * as twoFactor from '$lib/server/two-factor';
import { confirmTwoFactorSetupSchema } from '$lib/validations/auth';

import * as m from '$messages';

export const startTwoFactorSetup = form(async () => {
  return twoFactor.startSetup();
});

export const confirmTwoFactorSetup = form(confirmTwoFactorSetupSchema, async ({ _code }, issue) => {
  await checkRateLimit(issue._code);

  if (!(await twoFactor.confirmSetup(_code))) {
    invalid(issue._code(m.auth.twoFactor.invalidCode));
  }

  flashAndRedirect('/settings/security', 'success', m.auth.twoFactor.setupConfirmed);
});

export const disableTwoFactor = form(async () => {
  await twoFactor.disable();

  flashAndRedirect('/settings/security', 'success', m.settings.security.twoFactor.success.disable);
});

export const getTwoFactorRecoveryCodes = query(async () => {
  return twoFactor.getRecoveryCodes();
});

export const regenerateTwoFactorRecoveryCodes = form(async () => {
  return {
    recoveryCodes: await twoFactor.regenerateRecoveryCodes()
  };
});
