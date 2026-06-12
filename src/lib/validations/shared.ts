import * as v from 'valibot';

import { normalizeFullName } from '$lib/utils/name';

export const MAX_EMAIL_LENGTH = 64;
export const MAX_NAME_LENGTH = 128;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 32;

const NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:[ -]\p{L}[\p{L}\p{M}]*)*$/u;

export const optionalString = v.pipe(
  v.optional(v.pipe(v.string(), v.trim())),
  v.transform((value) => {
    return value ? value : undefined;
  })
);

export const trimmedString = v.pipe(v.string(), v.trim());

export const emailSchema = v.pipe(
  trimmedString,
  v.email('Invalid email address'),
  v.maxLength(MAX_EMAIL_LENGTH, 'Email must be less than 64 characters'),
  v.check((value) => !value.includes('test'), 'Test emails are not allowed'),
  v.check((value) => !value.includes('+'), 'Email address tagging is not allowed')
);

export const nameSchema = v.pipe(
  v.string(),
  v.transform(normalizeFullName),
  v.nonEmpty('Name is required'),
  v.regex(NAME_PATTERN, 'Name can only contain letters, spaces, or hyphens'),
  v.maxLength(MAX_NAME_LENGTH, 'Name must be less than 128 characters')
);

export const passwordSchema = v.pipe(
  trimmedString,
  v.minLength(MIN_PASSWORD_LENGTH, 'Password must be at least 8 characters'),
  v.maxLength(MAX_PASSWORD_LENGTH, 'Password must be less than 32 characters'),
  v.regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must contain at least one letter and one number')
);
