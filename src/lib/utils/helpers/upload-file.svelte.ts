// Env Variables
import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

// Utils
import { toast } from 'svelte-sonner';
import { validateImageFile } from '$lib/validations/files';

/**
 * Supported file types for upload operations.
 */
type FileType = 'image' | 'audio' | 'video' | 'document' | 'other';

/**
 * Upload status representing the current state of the operation.
 */
type UploadStatus = 'ready' | 'uploading' | 'uploaded' | 'failed';

/**
 * Result object returned by upload operations.
 */
interface UploadResult {
  fileId?: string | null;
  previewUrl?: string | null;
  errors?: string[];
}

/**
 * Encapsulates all upload state and logic within individual instances,
 * enabling multiple independent uploads with proper state isolation.
 */
export class FileUploader {
  type = $state<FileType>('image');
  status = $state<UploadStatus>('ready');
  progress = $state(0);
  errors = $state<string[]>([]);
  fileId = $state<string | null>(null);
  previewUrl = $state<string | null>(null);

  /**
   * Creates a new file uploader instance.
   *
   * @param type - Type of files this uploader will handle
   */
  constructor(type: FileType = 'image') {
    this.type = type;
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

  /**
   * Resets the uploader to its initial state.
   * Clears all errors, progress, and upload results.
   */
  reset(): void {
    this.status = 'ready';
    this.progress = 0;
    this.errors = [];
    this.fileId = null;
    this.previewUrl = null;
  }

  /**
   * Uploads a file with validation, presigned URL generation, progress tracking, and error handling.
   *
   * @param fileInputField - HTML input element containing the selected file
   * @param uploadDestinationDirectory - storage directory path
   * @param uploadType - Optional upload type for specialized validation
   * @returns Promise resolving to upload results
   */
  async upload(
    fileInputField: HTMLInputElement,
    uploadDestinationDirectory: string,
    uploadType?: 'avatar'
  ): Promise<UploadResult> {
    // Reset state for new upload
    this.reset();

    try {
      if (!fileInputField.files || fileInputField.files.length === 0) {
        this.errors = ['No file selected'];
        this.status = 'failed';
        return { errors: this.errors };
      }

      const file = fileInputField.files[0];

      // Validate file based on type
      if (this.type === 'image') {
        const { valid, errors } = validateImageFile(file, uploadType ?? '');

        if (!valid) {
          this.status = 'failed';
          this.errors = errors;
          toast.error(this.errors[0]);
          return { errors: this.errors };
        }
      }

      // Get presigned URL for upload
      const presignedResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          fileType: file.type,
          destinationDirectory: uploadDestinationDirectory
        })
      });

      if (!presignedResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const { fileName, presignedUrl } = await presignedResponse.json();

      // Set up XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Return a promise that resolves when upload completes
      return new Promise((resolve) => {
        xhr.upload.onloadstart = () => {
          this.status = 'uploading';
        };

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            this.progress = Math.round((e.loaded / e.total) * 100);
          }
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              this.progress = 0;
              this.status = 'uploaded';
              this.fileId = fileName;
              this.previewUrl = `${PUBLIC_R2_BUCKET_URL}/${uploadDestinationDirectory}/${fileName}`;

              toast.success('File uploaded successfully');
              resolve({
                fileId: this.fileId,
                previewUrl: this.previewUrl
              });
            } else {
              this.status = 'failed';
              this.errors = ['Error uploading file'];
              toast.error(this.errors[0]);
              resolve({ errors: this.errors });
            }
          }
        };

        xhr.onerror = () => {
          this.status = 'failed';
          this.errors = ['Network error during upload'];
          toast.error(this.errors[0]);
          resolve({ errors: this.errors });
        };

        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error('Upload error:', error);
      this.status = 'failed';
      this.errors = ['Unexpected error during upload'];
      toast.error(this.errors[0]);
      return { errors: this.errors };
    }
  }
}

/**
 * Image uploader instance for common use cases.
 */
export const imageFileUploader = new FileUploader('image');
