import { hash, verify } from '@node-rs/argon2';

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  return hashedPassword;
}

export async function verifyPassword(hashedPassword: string, password: string) {
  const isValid = await verify(hashedPassword, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  return isValid;
}
