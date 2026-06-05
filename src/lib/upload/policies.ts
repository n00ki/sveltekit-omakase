const BYTES_IN_MB = 1_000_000;
const DEFAULT_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;

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

export const UPLOAD_POLICY_IDS = ['file', 'image', 'userImage'] as const;
export type UploadPolicyId = (typeof UPLOAD_POLICY_IDS)[number];

type UploadPolicyConfig = {
  acceptedTypes?: readonly string[];
  directory: string;
  maxSize: number;
};

type UploadFile = {
  size: number;
  type: string;
};

export function mb(value: number): number {
  return Math.round(value * BYTES_IN_MB);
}

export function fileUpload(options: UploadOptions = {}): UploadPolicyConfig {
  const maxSize = options.maxSize ?? mb(10);

  return {
    acceptedTypes: options.acceptedTypes,
    directory: options.directory ?? 'files/uploads',
    maxSize
  };
}

export function imageUpload(options: UploadOptions = {}): UploadPolicyConfig {
  const maxSize = options.maxSize ?? mb(4);
  const acceptedTypes = options.acceptedTypes ?? DEFAULT_IMAGE_TYPES;

  return {
    acceptedTypes,
    directory: options.directory ?? 'images/uploads',
    maxSize
  };
}

export function defineUploadPolicies(policies: { [id: string]: UploadPolicyConfig }): { [id: string]: UploadPolicy } {
  return Object.fromEntries(Object.entries(policies).map(([id, policy]) => [id, createUploadPolicy(id, policy)]));
}

const uploadConfigs = {
  file: fileUpload(),
  image: imageUpload(),
  userImage: imageUpload({ directory: 'images/users', maxSize: mb(2) })
};

export const uploads = defineUploadPolicies(uploadConfigs);

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

function createUploadPolicy(id: string, config: UploadPolicyConfig): UploadPolicy {
  if (!Number.isSafeInteger(config.maxSize) || config.maxSize <= 0) {
    throw new Error(`Upload policy "${id}" must define a positive integer maxSize.`);
  }

  const acceptedTypes = normalizeAcceptedTypes(id, config.acceptedTypes);

  return {
    acceptedTypes,
    accept: acceptedTypes?.join(','),
    directory: normalizeDirectory(id, config.directory),
    id,
    maxSize: config.maxSize
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
