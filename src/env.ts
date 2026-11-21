import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

export const variables = defineEnvVars({
  PUBLIC_BASE_URL: {
    public: true,
    description: 'Public app URL for absolute links, SEO tags, and the Google OAuth callback.',
    schema: v.pipe(v.string(), v.url())
  },
  DATABASE_URL: {
    description: 'LibSQL connection URL, such as `file:local.db` or a Turso URL.',
    schema: v.pipe(v.string(), v.nonEmpty())
  },
  DATABASE_AUTH_TOKEN: {
    description: 'Turso auth token. Required in production.',
    schema: v.optional(v.string())
  },
  BETTER_AUTH_URL: {
    description: 'Base URL Better Auth uses for callbacks.',
    schema: v.pipe(v.string(), v.url())
  },
  BETTER_AUTH_SECRET: { description: 'Secret that signs Better Auth tokens. Use 32 random characters.' },
  GOOGLE_CLIENT_ID: { description: 'Google OAuth client ID.' },
  GOOGLE_CLIENT_SECRET: { description: 'Google OAuth client secret.' },
  R2_ACCOUNT_ID: { description: 'Cloudflare account ID for R2.' },
  R2_ACCESS_KEY_ID: { description: 'R2 API token access key ID.' },
  R2_SECRET_ACCESS_KEY: { description: 'R2 API token secret access key.' },
  PUBLIC_R2_BUCKET_NAME: { public: true, description: 'R2 bucket for uploads.' },
  PUBLIC_R2_BUCKET_URL: { public: true, description: 'Public URL of the R2 bucket.' },
  RESEND_API_KEY: { description: 'Resend API key for transactional email.' },
  EMAIL_SENDER: { description: 'From address for transactional email.' }
});
