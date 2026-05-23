import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

import avatarPlaceholder from '$lib/assets/avatar.png';

/**
 * Resolves avatar URLs with automatic fallback to placeholder.
 * Abstracts the complexity of handling both missing avatars and R2 storage paths,
 * ensuring consistent avatar display across the application.
 *
 * @param image - Avatar filename or null/undefined
 * @returns Complete avatar URL or placeholder path
 */
export function getAvatarUrl(image: string | null | undefined): string {
  if (!image) return avatarPlaceholder;

  // If it's already a full URL (e.g., from OAuth provider), use it directly
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  // Otherwise, it's a file ID from our R2 storage
  return `${PUBLIC_R2_BUCKET_URL}/images/avatars/${image}`;
}
