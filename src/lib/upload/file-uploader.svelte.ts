import type { UploadPolicy } from '$lib/upload/policies';

import { browser } from '$app/environment';

import { getUploadFileErrors } from '$lib/upload/policies';

const DEFAULT_FILE_TYPE = 'application/octet-stream';
const UPLOAD_ENDPOINT = '/api/upload';

export type UploadStatus = 'ready' | 'uploading' | 'uploaded' | 'failed';

export type UploadedFile = {
  id: string;
  key: string;
  url: string;
};

export type UploadResult =
  | {
      file: UploadedFile;
      success: true;
    }
  | {
      errors: string[];
      success: false;
    };

type PreparedUpload = {
  file: UploadedFile;
  uploadUrl: string;
};

export class FileUploader {
  status = $state<UploadStatus>('ready');
  progress = $state(0);
  errors = $state<string[]>([]);
  file = $state<UploadedFile | null>(null);

  constructor(readonly policy: UploadPolicy) {}

  get accept(): string | undefined {
    return this.policy.accept;
  }

  get isReady(): boolean {
    return this.status === 'ready';
  }

  get isUploading(): boolean {
    return this.status === 'uploading';
  }

  get isUploaded(): boolean {
    return this.status === 'uploaded';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  reset(): void {
    this.status = 'ready';
    this.progress = 0;
    this.errors = [];
    this.file = null;
  }

  async upload(file: File): Promise<UploadResult> {
    this.reset();

    if (!browser) {
      return this.fail(['Upload is only available in the browser.']);
    }

    const errors = getUploadFileErrors(file, this.policy);

    if (errors.length > 0) {
      return this.fail(errors);
    }

    this.status = 'uploading';

    try {
      const upload = await this.prepareUpload(file);

      if (!upload) {
        return this.fail(['Unable to prepare upload.']);
      }

      return await this.putFile(file, upload);
    } catch (error) {
      console.error('Upload error:', error);
      return this.fail(['Unexpected error while uploading file.']);
    }
  }

  private async prepareUpload(file: File): Promise<PreparedUpload | null> {
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file: {
          size: file.size,
          type: file.type || DEFAULT_FILE_TYPE
        },
        policy: this.policy.id
      })
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PreparedUpload;
  }

  private putFile(file: File, upload: PreparedUpload): Promise<UploadResult> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          this.progress = Math.round((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(this.complete(upload.file));
          return;
        }

        resolve(this.fail(['Unable to upload file.']));
      };

      xhr.onerror = () => {
        resolve(this.fail(['Network error while uploading file.']));
      };

      xhr.open('PUT', upload.uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type || DEFAULT_FILE_TYPE);
      xhr.send(file);
    });
  }

  private complete(file: UploadedFile): UploadResult {
    this.status = 'uploaded';
    this.progress = 100;
    this.errors = [];
    this.file = file;

    return { file, success: true };
  }

  private fail(errors: string[]): UploadResult {
    this.status = 'failed';
    this.progress = 0;
    this.errors = errors;
    this.file = null;

    return { errors, success: false };
  }
}
