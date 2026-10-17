import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

export const variables = defineEnvVars({
  PUBLIC_BASE_URL: { public: true, schema: v.pipe(v.string(), v.url()) },
  DATABASE_URL: { schema: v.pipe(v.string(), v.nonEmpty()) },
  DATABASE_AUTH_TOKEN: { schema: v.optional(v.string()) },
  BETTER_AUTH_URL: { schema: v.pipe(v.string(), v.url()) },
  BETTER_AUTH_SECRET: {},
  GOOGLE_CLIENT_ID: {},
  GOOGLE_CLIENT_SECRET: {},
  R2_ACCOUNT_ID: {},
  R2_ACCESS_KEY_ID: {},
  R2_SECRET_ACCESS_KEY: {},
  PUBLIC_R2_BUCKET_NAME: { public: true },
  PUBLIC_R2_BUCKET_URL: { public: true },
  RESEND_API_KEY: {},
  EMAIL_SENDER: {}
});
