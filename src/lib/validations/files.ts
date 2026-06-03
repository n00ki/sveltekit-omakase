import { z } from 'zod';

import { getUploadFileErrors, getUploadPolicy, UPLOAD_POLICY_IDS } from '$lib/upload/policies';

const uploadFileSchema = z.object({
  size: z.number().int().positive(),
  type: z.string().trim().min(1, { error: 'File type is required.' })
});

export const uploadRequestSchema = z
  .object({
    file: uploadFileSchema,
    policy: z.enum(UPLOAD_POLICY_IDS)
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
