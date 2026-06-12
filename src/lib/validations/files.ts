import * as v from 'valibot';

import { getUploadFileErrors, getUploadPolicy } from '$lib/upload/policies';
import { trimmedString } from '$lib/validations/shared';

import { config } from '$config';

const uploadFileSchema = v.object({
  size: v.pipe(v.number(), v.integer(), v.minValue(1)),
  type: v.pipe(trimmedString, v.minLength(1, 'File type is required.'))
});

export const uploadRequestSchema = v.pipe(
  v.object({
    file: uploadFileSchema,
    policy: v.picklist(config.upload.policyIds)
  }),
  v.rawCheck(({ dataset, addIssue }) => {
    if (!dataset.typed) return;

    const policy = getUploadPolicy(dataset.value.policy);

    for (const message of getUploadFileErrors(dataset.value.file, policy)) {
      addIssue({
        message,
        path: [
          {
            type: 'object',
            origin: 'value',
            input: dataset.value,
            key: 'file',
            value: dataset.value.file
          }
        ]
      });
    }
  })
);

export type UploadRequest = v.InferOutput<typeof uploadRequestSchema>;
