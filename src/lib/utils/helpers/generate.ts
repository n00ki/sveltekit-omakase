import { encodeBase64url } from '@oslojs/encoding';
import { customAlphabet } from 'nanoid';

const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 12;

export function generateNanoId() {
  const nanoid = customAlphabet(ID_ALPHABET, ID_LENGTH);
  return nanoid();
}

export function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(64));
  const token = encodeBase64url(bytes);
  return token;
}
