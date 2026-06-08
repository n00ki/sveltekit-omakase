import type { UploadConfig, UploadPolicyId } from '../config.schema';

import { mb } from '$lib/utils/size';

const DEFAULT_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;

export const uploadConfig: UploadConfig = {
  // Fallback Content-Type when the browser does not provide one
  fallbackContentType: 'application/octet-stream',
  defaultImageTypes: DEFAULT_IMAGE_TYPES,
  policyIds: ['file', 'image', 'userImage'],
  policies: {
    file: {
      directory: 'files/uploads',
      maxSize: mb(10)
    },
    image: {
      acceptedTypes: DEFAULT_IMAGE_TYPES,
      directory: 'images/uploads',
      maxSize: mb(4)
    },
    userImage: {
      acceptedTypes: DEFAULT_IMAGE_TYPES,
      directory: 'images/users',
      maxSize: mb(2)
    }
  }
};

export type { UploadPolicyId };
