import { z } from 'zod';

import { emailSchema, nameSchema, optionalString, passwordSchema } from '$lib/validations/shared';

import { config } from '$config';

export const createUserSchema = z
  .object({
    email: emailSchema,
    name: nameSchema,
    _password: passwordSchema,
    _passwordConfirmation: z.string().trim()
  })
  .refine((data) => data._password === data._passwordConfirmation, {
    error: 'Passwords do not match',
    path: ['_passwordConfirmation']
  });

export const loginSchema = z.object({
  email: emailSchema,
  _password: z.string().trim(),
  next: z.string().trim().optional()
});

export const requestPasswordResetSchema = z.object({
  email: emailSchema
});

export const resetUserPasswordSchema = z
  .object({
    email: z.email().optional(),
    token: z.string().trim(),
    _password: passwordSchema,
    _passwordConfirmation: z.string().trim()
  })
  .refine((data) => data._password === data._passwordConfirmation, {
    error: 'Passwords do not match',
    path: ['_passwordConfirmation']
  });

export const updateUserSchema = z.object({
  image: optionalString.pipe(z.uuid().optional()),
  name: optionalString.pipe(nameSchema.optional())
});

export const updateUserPasswordSchema = z
  .object({
    _password: passwordSchema,
    _passwordConfirmation: z.string().trim()
  })
  .refine((data) => data._password === data._passwordConfirmation, {
    error: 'Passwords do not match',
    path: ['_passwordConfirmation']
  });

export const deleteUserSchema = z
  .object({
    _confirmation: z.string().trim()
  })
  .refine((data) => data._confirmation === config.auth.deleteAccountConfirmationText, {
    error: `You must type "${config.auth.deleteAccountConfirmationText}" exactly to confirm`,
    path: ['_confirmation']
  });

const nextSchema = z.string().trim().optional();

export const totpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, { error: 'Enter the 6-digit code from your authenticator app' });

export const passwordChallengeSchema = z.object({
  next: nextSchema,
  _password: z.string().trim().min(1, { error: 'Password is required' })
});

export const totpChallengeSchema = z.object({
  next: nextSchema,
  _code: totpCodeSchema
});

export const recoveryChallengeSchema = z.object({
  next: nextSchema,
  _recoveryCode: z.string().trim().min(1, { error: 'Enter a recovery code' })
});

export const confirmTwoFactorSetupSchema = z.object({
  _code: totpCodeSchema
});
