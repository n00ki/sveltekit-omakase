import type { PublicConfig } from './config.schema';

import { appConfig } from './app';
import { authConfig } from './auth';
import { themeConfig } from './theme';
import { uiConfig } from './ui';
import { uploadConfig } from './upload';

export const config = {
  app: appConfig,
  auth: authConfig,
  theme: themeConfig,
  ui: uiConfig,
  upload: uploadConfig
} satisfies PublicConfig;

export type {
  AppConfig,
  AuthConfig,
  AuthSessionConfig,
  ChallengeConfig,
  ConfigSchema,
  PublicConfig,
  RateLimitConfig,
  ThemeConfig,
  ThemeType,
  UiConfig,
  UploadConfig,
  UploadPolicyDefinition,
  UploadPolicyId,
  UploadSigningConfig
} from './config.schema';
