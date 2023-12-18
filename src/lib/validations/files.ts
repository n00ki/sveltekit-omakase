// Avatar file validations
export function validateAvatarFile(avatarFile: File): { valid: boolean; errors: string[] } {
  let valid = true;
  const errors = [];

  if (!avatarFile) {
    return {
      valid: false,
      errors: ['Avatar file is required']
    };
  }

  if (avatarFile.size > 2000000) {
    valid = false;
    errors.push('Avatar file size must be less than 2MB');
  }

  if (!avatarFile.type.includes('image')) {
    valid = false;
    errors.push('Avatar file must be an image');
  }

  return {
    valid,
    errors
  };
}
