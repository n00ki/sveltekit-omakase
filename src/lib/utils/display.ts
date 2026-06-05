import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

import { uploads } from '$lib/upload';

import imagePlaceholder from '$lib/assets/avatar.png';

export function getUserImageUrl(image: string | null | undefined): string {
  if (!image) return imagePlaceholder;

  if (isRemoteImageUrl(image)) {
    return image;
  }

  return `${PUBLIC_R2_BUCKET_URL}/${uploads.userImage.directory}/${image}`;
}

export function isRemoteImageUrl(image: string): boolean {
  return image.startsWith('http://') || image.startsWith('https://');
}
