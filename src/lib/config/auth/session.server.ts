import type { AuthSessionConfig } from '../config.schema';

export const sessionConfig: AuthSessionConfig = {
  // Custom prefix for auth cookies
  cookiePrefix: 'somakase',
  // Session lifetime (seconds)
  expiresIn: 60 * 60 * 24 * 7
};
