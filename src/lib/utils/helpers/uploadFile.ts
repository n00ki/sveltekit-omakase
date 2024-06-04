// Types
import { PUBLIC_AWS_S3_BUCKET_URL } from '$env/static/public';

// Utils
import { validateImageFile } from '$lib/validations/files';
import { writable, type Writable } from 'svelte/store';
import { toast } from 'svelte-sonner';

export const fileUploadStatus: Writable<'ready' | 'uploading' | 'uploaded' | 'failed'> = writable('ready');
export const fileUploadProgress: Writable<number> = writable(0);
let fileUploadErrors: string[] = [];
let fileId: string | null = null;
let previewUrl: string | null = null;

export const uploadImageFile = async (
  fileInputField: HTMLInputElement,
  uploadDestinationDirectory: string,
  type?: 'avatar'
) => {
  fileUploadStatus.set('ready');

  try {
    if (!fileInputField.files) return;
    const file = fileInputField.files[0];

    const { valid, errors } = validateImageFile(file, type ?? '');

    if (!valid) {
      fileUploadStatus.set('failed');
      fileUploadErrors = errors;
      toast.error(fileUploadErrors[0]);
      return { fileUploadErrors };
    }

    const getPresignedUrl = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        fileType: file.type,
        destinationDirectory: uploadDestinationDirectory ?? ''
      })
    });

    const { fileName, presignedUrl } = await getPresignedUrl.json();

    const xhr = new XMLHttpRequest();

    xhr.upload.onloadstart = () => {
      fileUploadStatus.set('uploading');
    };

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        fileUploadProgress.set(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.open('PUT', presignedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          fileUploadProgress.set(0);
          toast.success('Image uploaded successfully');
          fileUploadStatus.set('uploaded');
        } else {
          fileUploadStatus.set('failed');
          fileUploadErrors = ['Error uploading image'];
          toast.error(fileUploadErrors[0]);
          return { fileUploadErrors };
        }
      }
    };

    fileId = fileName ?? '';
    previewUrl = `${PUBLIC_AWS_S3_BUCKET_URL}/${uploadDestinationDirectory}/${fileId}`;

    return { fileId, previewUrl };
  } catch {
    fileUploadStatus.set('failed');
    fileUploadErrors = ['Error uploading image'];
    toast.error(fileUploadErrors[0]);
    return { fileUploadErrors };
  }
};
