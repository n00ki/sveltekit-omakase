// Env Variables
import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

// Utils
import { validateImageFile } from '$lib/validations/files';
import { toast } from 'svelte-sonner';

interface FileUploadState {
  type: 'image' | 'audio' | 'video' | 'document';
  status: 'ready' | 'uploading' | 'uploaded' | 'failed';
  progress: number;
}

let fileUploadErrors: string[] = [];
let fileId: string | null = null;
let previewUrl: string | null = null;

export function createFileUploadState(type: FileUploadState['type']) {
  const state: FileUploadState = $state({
    type: type,
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
      state.type = type;
      state.status = 'ready';
      state.progress = 0;
    }
  };
}

export const imageFileUploadState = createFileUploadState('image');

export const uploadImageFile = async (
  fileInputField: HTMLInputElement,
  uploadDestinationDirectory: string,
  type?: 'avatar'
) => {
  imageFileUploadState.status = 'ready';

  try {
    if (!fileInputField.files) return;
    const file = fileInputField.files[0];

    const { valid, errors } = validateImageFile(file, type ?? '');

    if (!valid) {
      imageFileUploadState.status = 'failed';
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
      imageFileUploadState.status = 'uploading';
    };

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        imageFileUploadState.progress = Math.round((e.loaded / e.total) * 100);
      }
    };

    xhr.open('PUT', presignedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          imageFileUploadState.progress = 0;
          toast.success('Image uploaded successfully');
          imageFileUploadState.status = 'uploaded';
        } else {
          imageFileUploadState.status = 'failed';
          fileUploadErrors = ['Error uploading image'];
          toast.error(fileUploadErrors[0]);
          return { fileUploadErrors };
        }
      }
    };

    fileId = fileName ?? '';
    previewUrl = `${PUBLIC_R2_BUCKET_URL}/${uploadDestinationDirectory}/${fileId}`;

    return { fileId, previewUrl };
  } catch {
    imageFileUploadState.status = 'failed';
    fileUploadErrors = ['Error uploading image'];
    toast.error(fileUploadErrors[0]);
    return { fileUploadErrors };
  }
};
