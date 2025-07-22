import { z } from 'zod';

// Registration Form Validation
export const registrationSchema = z.object({
  email: z
    .email({ error: 'Invalid email address' })
    .trim()
    .max(64, { error: 'Email must be less than 64 characters' })
    .refine(
      (value) => {
        return !value.includes('test');
      },
      { error: 'Test emails are not allowed' }
    )
    .refine(
      (value) => {
        return !value.includes('+');
      },
      { error: 'Email address tagging is not allowed' }
    ),
  firstName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]*$/, { error: 'First name can only contain english letters' })
    .max(64, { error: 'First name must be less than 64 characters' })
    .transform((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }),
  lastName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]*$/, { error: 'Last name can only contain english letters' })
    .max(64, { error: 'Last name must be less than 64 characters' })
    .transform((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }),
  password: z
    .string()
    .trim()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(32, { error: 'Password must be less than 32 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
      error: 'Password must contain at least one letter and one number'
    }),
  passwordConfirmation: z.string().trim()
});

// Login Form Validation
export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }).trim().max(64, { error: 'Email must be less than 64 characters' }),
  password: z.string().trim()
});

// Request Password Reset Form Validation
export const requestPasswordResetSchema = z.object({
  email: z.email({ error: 'Invalid email address' }).trim()
});

// Reset Password Form Validation
export const passwordResetSchema = z.object({
  email: z.email().optional(),
  token: z.string().trim(),
  password: z
    .string()
    .trim()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(32, { error: 'Password must be less than 32 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
      error: 'Password must contain at least one letter and one number'
    }),
  passwordConfirmation: z.string().trim()
});

export const editUserSchema = z.object({
  avatarFileId: z.string().optional(),
  firstName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]*$/, { error: 'First name can only contain english letters' })
    .max(64, { error: 'First name must be less than 64 characters' })
    .transform((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    })
    .optional(),
  lastName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]*$/, { error: 'Last name can only contain english letters' })
    .max(64, { error: 'Last name must be less than 64 characters' })
    .transform((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    })
    .optional()
});

export const editPasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(32, { error: 'Password must be less than 32 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
      error: 'Password must contain at least one letter and one number'
    }),
  passwordConfirmation: z.string().trim()
});
