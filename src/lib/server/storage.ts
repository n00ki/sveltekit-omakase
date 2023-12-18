import {
  PRIVATE_AWS_ACCESS_KEY,
  PRIVATE_AWS_SECRET_ACCESS_KEY,
  PRIVATE_AWS_S3_BUCKET_REGION
} from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  credentials: {
    accessKeyId: PRIVATE_AWS_ACCESS_KEY,
    secretAccessKey: PRIVATE_AWS_SECRET_ACCESS_KEY
  },
  region: PRIVATE_AWS_S3_BUCKET_REGION
});
