import type { UploadSigningConfig } from '../config.schema';

export const uploadSigningConfig: UploadSigningConfig = {
  // How long a generated direct-upload URL remains usable (seconds)
  expiresIn: 300
};
