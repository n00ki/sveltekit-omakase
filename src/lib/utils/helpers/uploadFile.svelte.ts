// Env Variables
import { PUBLIC_AWS_S3_BUCKET_URL } from '$env/static/public';

// Utils
import { validateImageFile } from '$lib/validations/files';
import { toast } from 'svelte-sonner';

interface FileUploadState {
  status: 'ready' | 'uploading' | 'uploaded' | 'failed';
  progress: number;
}

let fileUploadErrors: string[] = [];
let fileId: string | null = null;
let previewUrl: string | null = null;

export function createFileUploadState() {
  let state: FileUploadState = $state({
    status: 'ready',
    progress: 0
  });

  return {
    get status() {
      return state.status;
    },

    set status(value) {
      state.status = value;
    },

    get progress() {
      return state.progress;
    },

    set progress(value) {
      state.progress = value;
    },

    reset() {
      state = {
        status: 'ready',
        progress: 0
      };
    }
  };
}

export const fileUploadState = createFileUploadState();

export const uploadImageFile = async (
  fileInputField: HTMLInputElement,
  uploadDestinationDirectory: string,
  type?: 'avatar'
) => {
  fileUploadState.status = 'ready';

  try {
    if (!fileInputField.files) return;
    const file = fileInputField.files[0];

    const { valid, errors } = validateImageFile(file, type ?? '');

    if (!valid) {
      fileUploadState.status = 'failed';
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
      fileUploadState.status = 'uploading';
    };

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        fileUploadState.progress = Math.round((e.loaded / e.total) * 100);
      }
    };

    xhr.open('PUT', presignedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          fileUploadState.progress = 0;
          toast.success('Image uploaded successfully');
          fileUploadState.status = 'uploaded';
        } else {
          fileUploadState.status = 'failed';
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
    fileUploadState.status = 'failed';
    fileUploadErrors = ['Error uploading image'];
    toast.error(fileUploadErrors[0]);
    return { fileUploadErrors };
  }
};
