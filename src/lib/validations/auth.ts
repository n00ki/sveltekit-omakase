import * as v from 'valibot';

import { isUploadKeyForPolicy, uploads } from '$lib/upload/policies';
import { emailSchema, nameSchema, optionalString, passwordSchema, trimmedString } from '$lib/validations/shared';

import { config } from '$config';

export const createUserSchema = v.pipe(
  v.object({
    email: emailSchema,
    name: nameSchema,
    _password: passwordSchema,
    _passwordConfirmation: trimmedString
  }),
  v.forward(
    v.partialCheck(
      [['_password'], ['_passwordConfirmation']],
      (data) => data._password === data._passwordConfirmation,
      'Passwords do not match'
    ),
    ['_passwordConfirmation']
  )
);

export const loginSchema = v.object({
  email: emailSchema,
  _password: trimmedString,
  next: v.optional(trimmedString)
});

export const requestPasswordResetSchema = v.object({
  email: emailSchema
});

export const resetUserPasswordSchema = v.pipe(
  v.object({
    email: v.optional(v.pipe(trimmedString, v.email('Invalid email address'))),
    token: trimmedString,
    _password: passwordSchema,
    _passwordConfirmation: trimmedString
  }),
  v.forward(
    v.partialCheck(
      [['_password'], ['_passwordConfirmation']],
      (data) => data._password === data._passwordConfirmation,
      'Passwords do not match'
    ),
    ['_passwordConfirmation']
  )
);

export const updateUserSchema = v.object({
  image: v.pipe(
    optionalString,
    v.check((image) => !image || isUploadKeyForPolicy(image, uploads.userImage), 'Invalid image')
  ),
  name: v.pipe(optionalString, v.optional(nameSchema))
});

export const updateUserPasswordSchema = v.pipe(
  v.object({
    _password: passwordSchema,
    _passwordConfirmation: trimmedString
  }),
  v.forward(
    v.partialCheck(
      [['_password'], ['_passwordConfirmation']],
      (data) => data._password === data._passwordConfirmation,
      'Passwords do not match'
    ),
    ['_passwordConfirmation']
  )
);

export const deleteUserSchema = v.object({
  _confirmation: v.pipe(
    trimmedString,
    v.literal(
      config.auth.deleteAccountConfirmationText,
      `You must type "${config.auth.deleteAccountConfirmationText}" exactly to confirm`
    )
  )
});

const nextSchema = v.optional(trimmedString);

export const totpCodeSchema = v.pipe(
  trimmedString,
  v.regex(/^\d{6}$/, 'Enter the 6-digit code from your authenticator app')
);

export const passwordChallengeSchema = v.object({
  next: nextSchema,
  _password: v.pipe(trimmedString, v.minLength(1, 'Password is required'))
});

export const totpChallengeSchema = v.object({
  next: nextSchema,
  _code: totpCodeSchema
});

export const recoveryChallengeSchema = v.object({
  next: nextSchema,
  _recoveryCode: v.pipe(trimmedString, v.minLength(1, 'Enter a recovery code'))
});

export const confirmTwoFactorSetupSchema = v.object({
  _code: totpCodeSchema
});
