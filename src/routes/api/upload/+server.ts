import { PUBLIC_R2_BUCKET_NAME, PUBLIC_R2_BUCKET_URL } from '$env/static/public';

import type { RequestHandler } from '@sveltejs/kit';

import { randomUUID } from 'node:crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { error, json } from '@sveltejs/kit';

import { requireAuth } from '$lib/server/auth';
import { s3 } from '$lib/server/storage';
import { getUploadPolicy } from '$lib/upload/policies';
import { uploadRequestSchema } from '$lib/validations/files';

import { config } from '$config/server';

export const POST: RequestHandler = async ({ request }) => {
  requireAuth();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    error(400, 'Invalid upload request');
  }

  const result = uploadRequestSchema.safeParse(body);

  if (!result.success) {
    error(400, 'Invalid upload request');
  }

  const { file, policy: policyId } = result.data;
  const policy = getUploadPolicy(policyId);

  try {
    const fileId = randomUUID();
    const key = `${policy.directory}/${fileId}`;

    const command = new PutObjectCommand({
      Bucket: PUBLIC_R2_BUCKET_NAME,
      ContentLength: file.size,
      ContentType: file.type,
      Key: key
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: config.upload.signing.expiresIn });

    return json({
      file: {
        id: fileId,
        key,
        url: `${PUBLIC_R2_BUCKET_URL}/${key}`
      },
      uploadUrl
    });
  } catch (err) {
    console.error('Failed to create upload URL:', err);
  }

  error(500, 'Something went wrong');
};
