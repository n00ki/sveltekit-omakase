import type { RequestHandler } from '@sveltejs/kit';

import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { requireAuth } from '#lib/server/auth.ts';
import { requireTwoFactor } from '#lib/server/security.ts';
import { prepareUpload } from '#lib/server/storage.ts';
import { uploadRequestSchema } from '#lib/validations/files.ts';

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
    return Response.json(await prepareUpload(result.output.policy, result.output.file));
  } catch (err) {
    console.error('Failed to create upload URL:', err);
  }

  error(500, 'Something went wrong');
};
