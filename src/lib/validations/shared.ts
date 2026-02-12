import { z } from 'zod';

export const MAX_EMAIL_LENGTH = 64;
export const MAX_NAME_LENGTH = 64;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 32;
export const MAX_SLUG_LENGTH = 50;
export const MAX_MESSAGE_LENGTH = 200;

const normalizeName = (value: string) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const nonEmptyString = z.string().trim().min(1);

export const optionalString = z
  .string()
  .optional()
  .transform((value) => (value?.trim() === '' || value === undefined ? undefined : value.trim()));

export const emailSchema = z
  .email({ error: 'Invalid email address' })
  .trim()
  .max(MAX_EMAIL_LENGTH, { error: 'Email must be less than 64 characters' })
  .refine((value) => !value.includes('test'), { error: 'Test emails are not allowed' })
  .refine((value) => !value.includes('+'), { error: 'Email address tagging is not allowed' });

export const firstNameSchema = z
  .string()
  .trim()
  .min(1, { error: 'First name is required' })
  .regex(/^[a-zA-Z\s]*$/, { error: 'First name can only contain english letters' })
  .max(MAX_NAME_LENGTH, { error: 'First name must be less than 64 characters' })
  .transform(normalizeName);

export const lastNameSchema = z
  .string()
  .trim()
  .min(1, { error: 'Last name is required' })
  .regex(/^[a-zA-Z\s]*$/, { error: 'Last name can only contain english letters' })
  .max(MAX_NAME_LENGTH, { error: 'Last name must be less than 64 characters' })
  .transform(normalizeName);

export const passwordSchema = z
  .string()
  .trim()
  .min(MIN_PASSWORD_LENGTH, { error: 'Password must be at least 8 characters' })
  .max(MAX_PASSWORD_LENGTH, { error: 'Password must be less than 32 characters' })
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    error: 'Password must contain at least one letter and one number'
  });

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_SLUG_LENGTH)
  .toLowerCase()
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

export const messageSchema = z.string().trim().max(MAX_MESSAGE_LENGTH);

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(50).default(20),
  offset: z.number().int().min(0).default(0)
});
