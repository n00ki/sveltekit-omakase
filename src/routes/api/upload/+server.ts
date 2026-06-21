import type { RequestHandler } from '@sveltejs/kit';

import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';

import { requireAuth } from '$lib/server/auth';
import { requireTwoFactor } from '$lib/server/security';
import { prepareUpload } from '$lib/server/storage';
import { uploadRequestSchema } from '$lib/validations/files';

export const POST: RequestHandler = async ({ request }) => {
  requireAuth();
  await requireTwoFactor();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    error(400, 'Invalid upload request');
  }

  const result = v.safeParse(uploadRequestSchema, body);

  if (!result.success) {
    error(400, 'Invalid upload request');
  }

  try {
    return json(await prepareUpload(result.output.policy, result.output.file));
  } catch (err) {
    console.error('Failed to create upload URL:', err);
  }

  error(500, 'Something went wrong');
};
