import type { Rate } from 'sveltekit-rate-limiter/server';

export type AppConfig = {
  description: string;
  name: string;
};

export type AuthConfig = {
  deleteAccountConfirmationText: string;
};

export type AuthSessionConfig = {
  cookiePrefix: string;
  expiresIn: number;
};

export type RateLimitConfig = {
  perIp: Rate;
  perIpAndUserAgent: Rate;
};

export type ChallengeConfig = {
  lifetimeMs: number;
};

export type ThemeType = 'system' | 'light' | 'dark';

export type ThemeConfig = {
  modes: Record<Uppercase<ThemeType>, ThemeType>;
};

export type UiConfig = {
  flashClearAfterMs: number;
  mobileBreakpoint: number;
};

export type UploadPolicyId = 'file' | 'image' | 'userImage';

export type UploadPolicyDefinition = {
  acceptedTypes?: readonly string[];
  directory: string;
  maxSize: number;
};

export type UploadConfig = {
  fallbackContentType: string;
  defaultImageTypes: readonly string[];
  policies: Record<UploadPolicyId, UploadPolicyDefinition>;
  policyIds: readonly [UploadPolicyId, ...UploadPolicyId[]];
};

export type UploadSigningConfig = {
  expiresIn: number;
};

export type PublicConfig = {
  app: AppConfig;
  auth: AuthConfig;
  theme: ThemeConfig;
  ui: UiConfig;
  upload: UploadConfig;
};

export type ConfigSchema = PublicConfig & {
  auth: AuthConfig & {
    session: AuthSessionConfig;
  };
  security: {
    challenge: ChallengeConfig;
    rateLimit: RateLimitConfig;
  };
  upload: UploadConfig & {
    signing: UploadSigningConfig;
  };
};
