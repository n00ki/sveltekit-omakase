import { z } from 'zod';

import { emailSchema, firstNameSchema, lastNameSchema, optionalString, passwordSchema } from '$lib/validations/shared';

export const createUserSchema = z
  .object({
    email: emailSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
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
  imageFileId: z.string().trim().optional(),
  firstName: optionalString.pipe(firstNameSchema.optional()),
  lastName: optionalString.pipe(lastNameSchema.optional())
});

export const updateUserPasswordSchema = z
  .object({
    _currentPassword: z.string().trim().optional(),
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
