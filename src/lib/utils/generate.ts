import { customAlphabet } from 'nanoid';
import { v7 as uuidv7 } from 'uuid';

/** Alphanumeric characters used for ID generation (lowercase, URL-safe) */
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Standard length for generated IDs across the application */
const ID_LENGTH = 12;

/**
 * Generates a time-ordered UUID v7 for database records.
 * UUIDs are sortable by creation time, making them ideal for primary keys.
 *
 * @returns A UUID v7 string
 */
export function generateUUIDv7(): string {
  return uuidv7();
}

/**
 * Generates consistent, URL-safe IDs for database records and file names.
 * Uses a curated alphabet to ensure compatibility across systems while maintaining
 * sufficient entropy for uniqueness.
 *
 * @returns A 12-character alphanumeric ID
 * @example
 * ```ts
 * const fileId = generateNanoId(); // "a1b2c3d4e5f6"
 * ```
 */
export function generateNanoId(): string {
  const nanoid = customAlphabet(ID_ALPHABET, ID_LENGTH);
  return nanoid();
}
