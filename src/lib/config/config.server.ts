import type { ConfigSchema } from './config.schema';

import { sessionConfig } from './auth/session.server';
import { config as publicConfig } from './config';
import { challengeConfig } from './security/challenge.server';
import { rateLimitConfig } from './security/rate-limit.server';
import { uploadSigningConfig } from './upload/signing.server';

export const config = {
  ...publicConfig,
  auth: {
    ...publicConfig.auth,
    session: sessionConfig
  },
  security: {
    challenge: challengeConfig,
    rateLimit: rateLimitConfig
  },
  upload: {
    ...publicConfig.upload,
    signing: uploadSigningConfig
  }
} satisfies ConfigSchema;

export type { ConfigSchema };
