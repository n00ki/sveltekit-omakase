import { describe, expect, it } from 'vitest';

import { defineUploadPolicies, fileUpload, getUploadFileErrors, mb, uploads } from '../../src/lib/upload';
import { uploadRequestSchema } from '../../src/lib/validations/files';

describe('upload policies', () => {
  it('keeps image defaults reusable for avatar uploads', () => {
    expect(uploads.image.directory).toBe('images/uploads');
    expect(uploads.image.maxSize).toBe(mb(4));
    expect(uploads.avatar.directory).toBe('images/avatars');
    expect(uploads.avatar.maxSize).toBe(mb(2));
    expect(uploads.avatar.accept).toBe('image/jpeg,image/jpg,image/png,image/webp');
  });

  it('validates files against the selected policy', () => {
    expect(getUploadFileErrors({ size: mb(1), type: 'image/png' }, uploads.avatar)).toEqual([]);
    expect(getUploadFileErrors({ size: mb(3), type: 'image/png' }, uploads.avatar)).toEqual([
      'File size must be less than 2MB.'
    ]);
    expect(getUploadFileErrors({ size: mb(1), type: 'application/pdf' }, uploads.avatar)).toEqual([
      'File type is not supported.'
    ]);
  });

  it('allows explicit MIME overrides without changing policy mechanics', () => {
    const policies = defineUploadPolicies({
      attachment: fileUpload({ acceptedTypes: ['application/pdf'], directory: 'files/attachments', maxSize: mb(5) })
    });

    expect(getUploadFileErrors({ size: mb(1), type: 'application/pdf' }, policies.attachment)).toEqual([]);
    expect(getUploadFileErrors({ size: mb(1), type: 'image/png' }, policies.attachment)).toEqual([
      'File type is not supported.'
    ]);
  });

  it('rejects unsafe upload directories at definition time', () => {
    expect(() =>
      defineUploadPolicies({
        unsafe: fileUpload({ directory: '../private' })
      })
    ).toThrow('Upload policy "unsafe" must use a relative directory.');
  });
});

describe('upload request validation', () => {
  it('accepts only known policy ids', () => {
    const result = uploadRequestSchema.safeParse({
      file: { size: mb(1), type: 'image/png' },
      policy: 'custom'
    });

    expect(result.success).toBe(false);
  });

  it('re-checks file limits before signing uploads', () => {
    const result = uploadRequestSchema.safeParse({
      file: { size: mb(20), type: 'image/png' },
      policy: 'avatar'
    });

    expect(result.success).toBe(false);
  });
});
