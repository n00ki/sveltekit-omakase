import { customAlphabet } from 'nanoid';

/** Alphanumeric characters used for ID generation (lowercase, URL-safe) */
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Standard length for generated IDs across the application */
const ID_LENGTH = 12;

/**
 * Generates consistent, URL-safe IDs for database records and file names.
 * Uses a curated alphabet to ensure compatibility across systems while maintaining
 * sufficient entropy for uniqueness.
 *
 * @returns A 12-character alphanumeric ID
 * @example
 * ```ts
 * const userId = generateNanoId(); // "a1b2c3d4e5f6"
 * ```
 */
export function generateNanoId() {
  const nanoid = customAlphabet(ID_ALPHABET, ID_LENGTH);
  return nanoid();
}
