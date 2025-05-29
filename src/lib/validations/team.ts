import { z } from 'zod';

// Create Team Form Validation
export const createTeamSchema = z.object({
  userId: z.number({ required_error: 'User is required' }),
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, { message: 'Team name must be at least 3 characters' })
    .max(64, { message: 'Team name must be less than 64 characters' })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      message: 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'
    })
});

// Edit Team Form Validation
export const editTeamSchema = z.object({
  teamId: z.number({ required_error: 'Team is required' }).nonnegative(),
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, { message: 'Team name must be at least 3 characters' })
    .max(64, { message: 'Team name must be less than 64 characters' })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      message: 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'
    })
});

// Delete Team Form Validation
export const deleteTeamSchema = z.object({
  teamId: z.number({ required_error: 'Team is required' }).nonnegative()
});

// Team Invite Form Validation
export const createTeamInviteSchema = z.object({
  teamId: z.number({ required_error: 'Team is required' }).nonnegative(),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(64, { message: 'Email must be less than 64 characters' })
    .email({ message: 'Email is invalid' })
});

// Remove User From Team Form Validation (or Leave Team)
export const leaveTeamSchema = z.object({
  teamId: z.number({ required_error: 'Team is required' }).nonnegative(),
  userId: z.number({ required_error: 'User is required' })
});
