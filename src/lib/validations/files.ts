import { z } from 'zod';

const MAX_AVATAR_SIZE = 2000000; // 2MB
const MAX_IMAGE_SIZE = 4000000; // 4MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;
const IMAGE_UPLOAD_TYPES = ['avatar', 'image'] as const;

export type ImageUploadType = (typeof IMAGE_UPLOAD_TYPES)[number];

export const uploadRequestSchema = z
  .object({
    destinationDirectory: z.string().trim().min(1, { error: 'Upload destination is required.' }),
    fileSize: z.number().int().positive(),
    fileType: z.enum(ACCEPTED_IMAGE_TYPES),
    uploadType: z.enum(IMAGE_UPLOAD_TYPES)
  })
  .superRefine(({ fileSize, uploadType }, ctx) => {
    const sizeLimit = uploadType === 'avatar' ? MAX_AVATAR_SIZE : MAX_IMAGE_SIZE;

    if (fileSize <= sizeLimit) return;

    ctx.addIssue({
      code: 'custom',
      path: ['fileSize'],
      message: uploadType === 'avatar' ? 'Avatar size must be less than 2MB.' : 'Image size must be less than 4MB.'
    });
  });

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    error: 'Image size must be less than 4MB.'
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.some((type) => type === file.type), {
    error: 'Only .jpg, .jpeg, .png and .webp formats are supported.'
  });

export const avatarFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_AVATAR_SIZE, {
    error: 'Avatar size must be less than 2MB.'
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.some((type) => type === file.type), {
    error: 'Only .jpg, .jpeg, .png and .webp formats are supported.'
  });

export function validateImageFile(
  imageFile: File,
  type: ImageUploadType
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
  return validateImageFile(avatarFile, 'avatar');
}
