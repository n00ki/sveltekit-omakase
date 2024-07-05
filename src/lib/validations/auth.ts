import { z } from 'zod';

// Registration Form Validation
export const registrationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(64, { message: 'Email must be less than 64 characters' })
    .email({ message: 'Email is invalid' })
    .refine(
      (value) => {
        return !value.includes('test');
      },
      { message: 'Test emails are not allowed' }
    )
    .refine(
      (value) => {
        return !value.includes('+');
      },
      { message: 'Email address tagging is not allowed' }
    ),
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .regex(/^[a-zA-Z\s]*$/, { message: 'First name can only contain english letters' })
    .min(1, { message: 'First name is required' })
    .max(64, { message: 'First name must be less than 64 characters' })
    .transform((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .regex(/^[a-zA-Z\s]*$/, { message: 'Last name can only contain english letters' })
    .min(1, { message: 'Last name is required' })
    .max(64, { message: 'Last name must be less than 64 characters' })
    .transform((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password must be less than 32 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must contain at least one letter and one number'),
  passwordConfirmation: z
    .string({ required_error: 'Password confirmation is required' })
    .trim()
    .min(1, { message: 'Password confirmation is required' })
});

// Login Form Validation
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(64, { message: 'Email must be less than 64 characters' })
    .email({ message: 'Email is invalid' }),
  password: z.string({ required_error: 'Password is required' }).trim().min(1, { message: 'Password is required' })
});

// Request Password Reset Form Validation
export const requestPasswordResetSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().min(1, { message: 'Email is required' })
});

// Reset Password Form Validation
export const resetPasswordSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().email({ message: 'Email is invalid' }),
  token: z.string({ required_error: 'Token is required' }).trim().min(1, { message: 'Token is required' }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(32, { message: 'Password must be less than 32 characters' }),

  passwordConfirmation: z
    .string({ required_error: 'Password confirmation is required' })
    .trim()
    .min(1, { message: 'Password confirmation is required' })
});

export const editUserSchema = z.object({
  avatar: z.string({ required_error: 'Avatar is required' })
});
