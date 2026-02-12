/**
 * Normalizes a string into a URL-safe slug.
 * Converts to lowercase, replaces spaces with hyphens, removes invalid characters,
 * and cleans up consecutive/leading/trailing hyphens.
 *
 * @param value - The string to normalize
 * @param maxLength - Maximum length of the result (default: 20)
 * @returns A URL-safe slug
 */
export function normalize(value: string, maxLength = 20): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength);
}
