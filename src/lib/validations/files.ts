import { z } from 'zod';

import { getUploadFileErrors, getUploadPolicy } from '$lib/upload/policies';

import { config } from '$config';

const uploadFileSchema = z.object({
  size: z.number().int().positive(),
  type: z.string().trim().min(1, { error: 'File type is required.' })
});

export const uploadRequestSchema = z
  .object({
    file: uploadFileSchema,
    policy: z.enum(config.upload.policyIds)
  })
  .superRefine(({ file, policy: policyId }, ctx) => {
    const policy = getUploadPolicy(policyId);

    for (const message of getUploadFileErrors(file, policy)) {
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['file']
      });
    }
  });

export type UploadRequest = z.infer<typeof uploadRequestSchema>;
