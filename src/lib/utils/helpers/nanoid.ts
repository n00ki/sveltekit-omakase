import { customAlphabet } from 'nanoid';

const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const TOKEN_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
const ID_LENGTH = 12;
const TOKEN_LENGTH = 64;

export function generateNanoId(opts?: { token?: boolean }) {
  const nanoid = customAlphabet(opts?.token ? TOKEN_ALPHABET : ID_ALPHABET, opts?.token ? TOKEN_LENGTH : ID_LENGTH);
  return nanoid();
}
