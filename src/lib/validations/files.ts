// Image file validations
export function validateImageFile(
  imageFile: File,
  type: string
): {
  valid: boolean;
  errors: string[];
} {
  let valid = true;
  const errors = [];

  if (!imageFile) {
    return {
      valid: false,
      errors: ['Image file is required']
    };
  }

  if (type === 'avatar') {
    if (imageFile.size > 2000000) {
      valid = false;
      errors.push('Avatar size must be less than 2MB');
    }

    if (!imageFile.type.includes('image')) {
      valid = false;
      errors.push('Avatar must be an image');
    }
  } else {
    if (imageFile.size > 4000000) {
      valid = false;
      errors.push('Image size must be less than 4MB');
    }

    if (!imageFile.type.includes('image')) {
      valid = false;
      errors.push('Image must be an image');
    }
  }

  return {
    valid,
    errors
  };
}

// Avatar file validations
export function validateAvatarFile(avatarFile: File): {
  valid: boolean;
  errors: string[];
} {
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

// Artist image file validations
export function validateArtistImageFile(imageFile: File): {
  valid: boolean;
  errors: string[];
} {
  let valid = true;
  const errors = [];

  if (!imageFile) {
    return {
      valid: false,
      errors: ['Image file is required']
    };
  }

  if (imageFile.size > 5000000) {
    valid = false;
    errors.push('Image file size must be less than 5MB');
  }

  if (!imageFile.type.includes('image')) {
    valid = false;
    errors.push('Image file must be an image');
  }

  return {
    valid,
    errors
  };
}
