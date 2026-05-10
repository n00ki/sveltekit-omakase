import { v7 as uuidv7 } from 'uuid';

const PUBLIC_ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const PUBLIC_ID_LENGTH = 12;
const PUBLIC_ID_REJECTION_LIMIT = Math.floor(256 / PUBLIC_ID_ALPHABET.length) * PUBLIC_ID_ALPHABET.length;

export function generateUUIDv7(): string {
  return uuidv7();
}

export function generatePublicId(): string {
  let id = '';

  while (id.length < PUBLIC_ID_LENGTH) {
    const bytes = crypto.getRandomValues(new Uint8Array(PUBLIC_ID_LENGTH));

    for (const byte of bytes) {
      if (byte >= PUBLIC_ID_REJECTION_LIMIT) {
        continue;
      }

      id += PUBLIC_ID_ALPHABET[byte % PUBLIC_ID_ALPHABET.length];

      if (id.length === PUBLIC_ID_LENGTH) {
        break;
      }
    }
  }

  return id;
}
