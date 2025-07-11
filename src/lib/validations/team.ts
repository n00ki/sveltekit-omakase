import { z } from 'zod';

// Create Team Form Validation
export const createTeamSchema = z.object({
  userId: z.int(),
  name: z
    .string()
    .trim()
    .min(3, { error: 'Team name must be at least 3 characters' })
    .max(64, { error: 'Team name must be less than 64 characters' })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      error: 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'
    })
});

// Edit Team Form Validation
export const editTeamSchema = z.object({
  teamId: z.int().nonnegative(),
  name: z
    .string()
    .trim()
    .min(3, { error: 'Team name must be at least 3 characters' })
    .max(64, { error: 'Team name must be less than 64 characters' })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      error: 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'
    })
});

// Delete Team Form Validation
export const deleteTeamSchema = z.object({
  teamId: z.int().nonnegative()
});

// Team Invite Form Validation
export const createTeamInviteSchema = z.object({
  teamId: z.int().nonnegative(),
  email: z.email({ error: 'Invalid email address' }).trim().max(64, { error: 'Email must be less than 64 characters' })
});

// Remove User From Team Form Validation (or Leave Team)
export const leaveTeamSchema = z.object({
  teamId: z.int().nonnegative(),
  userId: z.int()
});
