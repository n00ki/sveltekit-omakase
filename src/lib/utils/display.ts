import { getUploadUrl } from '$lib/upload/policies';

import imagePlaceholder from '$lib/assets/avatar.png';

export function getUserImageUrl(image: string | null | undefined): string {
  if (!image) return imagePlaceholder;

  if (isRemoteImageUrl(image)) {
    return image;
  }

  return getUploadUrl(image);
}

export function isRemoteImageUrl(image: string): boolean {
  return image.startsWith('http://') || image.startsWith('https://');
}
