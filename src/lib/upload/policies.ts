import { BYTES_IN_MB } from '$lib/utils/size';

import type { UploadPolicyDefinition, UploadPolicyId } from '$config';
import { config } from '$config';

export type { UploadPolicyId };

export type UploadOptions = {
  acceptedTypes?: readonly string[];
  directory?: string;
  maxSize?: number;
};

export type UploadPolicy = {
  acceptedTypes?: readonly string[];
  accept?: string;
  directory: string;
  id: string;
  maxSize: number;
};

type UploadFile = {
  size: number;
  type: string;
};

export function fileUpload(options: UploadOptions = {}): UploadPolicyDefinition {
  const maxSize = options.maxSize ?? config.upload.policies.file.maxSize;

  return {
    acceptedTypes: options.acceptedTypes,
    directory: options.directory ?? config.upload.policies.file.directory,
    maxSize
  };
}

export function imageUpload(options: UploadOptions = {}): UploadPolicyDefinition {
  const acceptedTypes = options.acceptedTypes ?? config.upload.defaultImageTypes;
  const maxSize = options.maxSize ?? config.upload.policies.image.maxSize;

  return {
    acceptedTypes,
    directory: options.directory ?? config.upload.policies.image.directory,
    maxSize
  };
}

function createUploadPolicies(policies: { [id: string]: UploadPolicyDefinition }): {
  [id: string]: UploadPolicy;
} {
  return Object.fromEntries(Object.entries(policies).map(([id, policy]) => [id, createUploadPolicy(id, policy)]));
}

export const uploads = createUploadPolicies(config.upload.policies);

export function getUploadPolicy(id: UploadPolicyId): UploadPolicy {
  return uploads[id];
}

export function getUploadFileErrors(file: UploadFile, policy: UploadPolicy): string[] {
  const errors: string[] = [];

  if (file.size > policy.maxSize) {
    errors.push(`File size must be less than ${formatFileSize(policy.maxSize)}.`);
  }

  if (policy.acceptedTypes && !policy.acceptedTypes.some((type) => matchesAcceptedType(file.type, type))) {
    errors.push('File type is not supported.');
  }

  return errors;
}

function createUploadPolicy(id: string, policy: UploadPolicyDefinition): UploadPolicy {
  if (!Number.isSafeInteger(policy.maxSize) || policy.maxSize <= 0) {
    throw new Error(`Upload policy "${id}" must define a positive integer maxSize.`);
  }

  const acceptedTypes = normalizeAcceptedTypes(id, policy.acceptedTypes);

  return {
    acceptedTypes,
    accept: acceptedTypes?.join(','),
    directory: normalizeDirectory(id, policy.directory),
    id,
    maxSize: policy.maxSize
  };
}

function normalizeAcceptedTypes(
  id: string,
  acceptedTypes: readonly string[] | undefined
): readonly string[] | undefined {
  if (!acceptedTypes) return undefined;

  const normalizedTypes = acceptedTypes.map((type) => type.trim()).filter(Boolean);

  if (normalizedTypes.length === 0) {
    throw new Error(`Upload policy "${id}" must not define an empty acceptedTypes list.`);
  }

  return normalizedTypes;
}

function normalizeDirectory(id: string, directory: string): string {
  const normalizedDirectory = directory.trim();
  const parts = normalizedDirectory.split('/');
  const isValidDirectory =
    normalizedDirectory.length > 0 &&
    !normalizedDirectory.startsWith('/') &&
    !normalizedDirectory.endsWith('/') &&
    parts.every((part) => part.length > 0 && part !== '.' && part !== '..');

  if (!isValidDirectory) {
    throw new Error(`Upload policy "${id}" must use a relative directory.`);
  }

  return normalizedDirectory;
}

function matchesAcceptedType(fileType: string, acceptedType: string): boolean {
  if (acceptedType.endsWith('/*')) {
    return fileType.startsWith(acceptedType.slice(0, -1));
  }

  return fileType === acceptedType;
}

function formatFileSize(size: number): string {
  if (size >= BYTES_IN_MB && size % BYTES_IN_MB === 0) {
    return `${size / BYTES_IN_MB}MB`;
  }

  return `${size.toLocaleString('en-US')} bytes`;
}
