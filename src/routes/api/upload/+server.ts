import { PUBLIC_R2_BUCKET_NAME } from '$env/static/public';

import type { RequestHandler } from '@sveltejs/kit';

import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { error, json } from '@sveltejs/kit';

import { auth } from '$lib/server/auth';
import { s3 } from '$lib/server/storage';

export const POST: RequestHandler = async ({ request }) => {
  const session = await auth.api.getSession(request);

  if (!session?.user) {
    error(401, 'Unauthorized');
  }

  try {
    const { fileType, destinationDirectory } = await request.json();

    const fileName = crypto.randomBytes(16).toString('hex');

    const file = {
      Bucket: PUBLIC_R2_BUCKET_NAME,
      Key: `${destinationDirectory}/${fileName}`,
      ContentType: fileType
    };

    const command = new PutObjectCommand(file);
    const url = await getSignedUrl(s3, command, { expiresIn: 60000 });

    return json({
      presignedUrl: url,
      fileName
    });
  } catch (err) {
    console.log(err);
  }

  error(500, 'Something went wrong');
};
