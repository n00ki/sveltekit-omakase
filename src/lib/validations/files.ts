import { z } from 'zod';

const MAX_AVATAR_SIZE = 2000000; // 2MB
const MAX_IMAGE_SIZE = 4000000; // 4MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    error: 'Image size must be less than 4MB.'
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    error: 'Only .jpg, .jpeg, .png and .webp formats are supported.'
  });

export const avatarFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_AVATAR_SIZE, {
    error: 'Avatar size must be less than 2MB.'
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    error: 'Only .jpg, .jpeg, .png and .webp formats are supported.'
  });

export function validateImageFile(
  imageFile: File,
  type: string
): {
  valid: boolean;
  errors: string[];
} {
  const schema = type === 'avatar' ? avatarFileSchema : imageFileSchema;
  const result = schema.safeParse(imageFile);

  return {
    valid: result.success,
    errors: result.success ? [] : result.error.issues.map((e) => e.message)
  };
}

// Avatar file validations
export function validateAvatarFile(avatarFile: File): {
  valid: boolean;
  errors: string[];
} {
  const result = avatarFileSchema.safeParse(avatarFile);

  return {
    valid: result.success,
    errors: result.success ? [] : result.error.issues.map((e) => e.message)
  };
}
