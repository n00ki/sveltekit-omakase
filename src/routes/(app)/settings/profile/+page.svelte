<script lang="ts">
  // Env Variables
  import { PUBLIC_AWS_S3_BUCKET_URL } from '$env/static/public';

  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { uploadImageFile, fileUploadState } from '$lib/utils/helpers/uploadFile.svelte';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/utils/messages.json';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import { Button } from '$components/ui/button';
  import * as AlertDialog from '$components/ui/alert-dialog';
  import * as Alert from '$components/ui/alert';
  import { Separator } from '$components/ui/separator';

  // Schemas
  import { editUserSchema } from '$lib/validations/auth';

  // Assets
  import avatarPlaceholder from '$lib/assets/avatar.png';
  import { Reload, Symbol, CrossCircled } from 'svelte-radix';

  let { data } = $props();

  let avatarFileId: string | null = null;
  let fileUploadErrors: string[] = $state([]);
  let avatarPreviewElement: HTMLImageElement | null = $state(null);

  let userAvatar = $state(
    data.user?.avatar ? `${PUBLIC_AWS_S3_BUCKET_URL}/avatars/${data.user.avatar}` : avatarPlaceholder
  );

  $effect(() => {
    if (fileUploadState.status === 'uploaded') {
      document.getElementById('edit-user-form')?.dispatchEvent(new Event('submit'));
    }
  });

  async function uploadAvatar(event: Event) {
    const avatarInputField: HTMLInputElement = event.target as HTMLInputElement;
    if (!avatarInputField.files) return;

    const upload = await uploadImageFile(avatarInputField, 'avatars', 'avatar');

    if (upload) {
      if (upload.fileUploadErrors) {
        fileUploadErrors = upload.fileUploadErrors;
        return;
      }

      avatarFileId = upload.fileId;
      userAvatar = upload.previewUrl;
    }
  }

  const form = superForm(data.form, {
    validators: zodClient(editUserSchema),
    onSubmit: async ({ formData, cancel }) => {
      if (avatarFileId) {
        formData.set('avatar', avatarFileId as string);
      } else {
        formData.delete('avatar');
      }

      // prevent a request if the form is empty
      if (!avatarFileId) {
        cancel();
        toast.error('No changes were made');
      }
    }
  });

  const { enhance, delayed } = form;
</script>

<div class="flex w-full flex-1 flex-col justify-center">
  <div class="mx-auto my-2 flex h-32 w-32 rounded-full p-1 ring-4 ring-accent drop-shadow-xs">
    <div class="m-auto flex h-full w-full items-center justify-center overflow-hidden rounded-full">
      {#if fileUploadState.status === 'uploading'}
        <Symbol class="h-6 w-6 animate-spin" />
      {:else}
        <img
          bind:this={avatarPreviewElement}
          src={userAvatar}
          alt="avatar preview"
          class="min-h-full min-w-full shrink-0 object-cover"
        />
      {/if}
    </div>
  </div>

  <form id="edit-user-form" method="POST" action="?/editUser" enctype="multipart/form-data" use:enhance>
    <Form.Field name="avatar" {form}>
      {#snippet children({ constraints })}
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Avatar</Form.Label>
            <Input
              type="file"
              onchange={uploadAvatar}
              disabled={fileUploadState.status === 'uploading'}
              class="file:p-1 file:text-foreground"
              {...props}
              {...constraints}
            />
            <Form.FieldErrors />
          {/snippet}
        </Form.Control>
      {/snippet}
    </Form.Field>

    <Form.Button disabled={$delayed} variant="secondary" class="my-2 hidden w-full">
      {#if $delayed}
        <Reload class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      Update
    </Form.Button>
  </form>

  {#if fileUploadState.status === 'failed'}
    {#each fileUploadErrors as error}
      <Alert.Root variant="destructive" class="inline-flex items-center gap-2 py-2">
        <div>
          <CrossCircled class="h-6 w-6" />
        </div>
        <Alert.Description>{error}</Alert.Description>
      </Alert.Root>
    {/each}
  {/if}

  <Separator class="my-4" />

  <h2 class="text-lg font-semibold">Danger Zone</h2>
  <AlertDialog.Root>
    <AlertDialog.Trigger class="w-full">
      <Button variant="destructive" class="my-2 w-full">Delete Account</Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          {m.accounts.delete.destructiveOperation}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Back to safety</AlertDialog.Cancel>
        <AlertDialog.Action
          type="submit"
          form="delete-user-form"
          class="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
        >
          Continue
          <form
            id="delete-user-form"
            action="?/deleteUser"
            method="POST"
            class="mx-auto flex w-full flex-col items-center justify-center"
          ></form>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
