import { R2_ACCESS_KEY_ID, R2_ACCOUNT_ID, R2_SECRET_ACCESS_KEY } from '$env/static/private';
import { PUBLIC_R2_BUCKET_NAME } from '$env/static/public';

import type { PreparedUpload, UploadFile, UploadPolicyId } from '$lib/upload/policies';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { createUploadKey, getUploadPolicy, getUploadUrl } from '$lib/upload/policies';

import { config } from '$config/server';

const r2Endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const s3 = new S3Client({
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  },
  region: 'auto'
});

export async function prepareUpload(policyId: UploadPolicyId, file: UploadFile): Promise<PreparedUpload> {
  const policy = getUploadPolicy(policyId);
  const key = createUploadKey(policy, crypto.randomUUID());
  const command = new PutObjectCommand({
    Bucket: PUBLIC_R2_BUCKET_NAME,
    ContentLength: file.size,
    ContentType: file.type,
    Key: key
  });

  return {
    file: {
      key,
      url: getUploadUrl(key)
    },
    uploadUrl: await getSignedUrl(s3, command, { expiresIn: config.upload.signing.expiresIn })
  };
}
