import { z } from 'zod';

import { emailSchema, nameSchema, optionalString, passwordSchema } from '$lib/validations/shared';

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
  _password: z.string().trim()
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

const CONFIRMATION_PHRASE = 'DELETE';

export const deleteUserSchema = z
  .object({
    _confirmation: z.string().trim()
  })
  .refine((data) => data._confirmation === CONFIRMATION_PHRASE, {
    error: `You must type "${CONFIRMATION_PHRASE}" exactly to confirm`,
    path: ['_confirmation']
  });

export const challengeSchema = z.object({
  next: z.string().trim().optional(),
  _password: z.string().trim().min(1, { error: 'Password is required' })
});
