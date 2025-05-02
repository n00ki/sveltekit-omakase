<script lang="ts">
  // Env Variables
  import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { uploadImageFile, imageFileUploadState } from '$lib/utils/helpers/uploadFile.svelte';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/utils/messages.json';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import { buttonVariants } from '$components/ui/button';
  import * as AlertDialog from '$components/ui/alert-dialog';
  import * as Alert from '$components/ui/alert';
  import { Separator } from '$components/ui/separator';

  // Schemas
  import { editUserSchema } from '$lib/validations/auth';

  // Assets
  import avatarPlaceholder from '$lib/assets/avatar.png';
  import { RotateCw, RefreshCw, CircleX } from '@lucide/svelte';

  let { data } = $props();

  let avatarFileId: string | null = null;
  let fileUploadErrors: string[] = $state([]);

  let userAvatar = $state(
    data.user?.avatar ? `${PUBLIC_R2_BUCKET_URL}/avatars/${data.user.avatar}` : avatarPlaceholder
  );

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

  const CONFIRMATION_PHRASE = 'DELETE';
  let deleteConfirmationInput = $state('');
  let isDeleteConfirmed = $derived(deleteConfirmationInput === CONFIRMATION_PHRASE);

  $effect(() => {
    if (imageFileUploadState.status === 'uploaded') {
      document.getElementById('edit-user-form')?.dispatchEvent(new Event('submit'));
    }
  });
</script>

<div class="flex w-full flex-1 flex-col justify-center">
  <h3 class="mb-0.5 text-base font-medium">Profile</h3>
  <div class="ring-accent mx-auto my-2 flex h-32 w-32 rounded-full p-1 ring-4 drop-shadow-xs">
    <div class="m-auto flex h-full w-full items-center justify-center overflow-hidden rounded-full">
      {#if imageFileUploadState.status === 'uploading'}
        <RefreshCw size="24" class="animate-spin" />
      {:else}
        {#key userAvatar}
          <img src={userAvatar} alt="avatar preview" class="min-h-full min-w-full shrink-0 object-cover" />
        {/key}
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
              accept="image/*"
              onchange={uploadAvatar}
              disabled={imageFileUploadState.status === 'uploading'}
              class="file:text-foreground file:p-1"
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
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      Update
    </Form.Button>
  </form>

  {#if imageFileUploadState.status === 'failed'}
    <div class="space-y-2">
      {#each fileUploadErrors as error, index (index)}
        <Alert.Root variant="destructive" class="inline-flex items-center gap-2 py-2">
          <div>
            <CircleX size="24" />
          </div>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      {/each}
    </div>
  {/if}

  <Separator class="my-4" />

  <h3 class="mb-0.5 text-base font-medium">Danger Zone</h3>
  <div class="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
    <div class="relative space-y-0.5 text-red-600 dark:text-red-100">
      <p class="font-medium">Warning</p>
      <p class="text-sm">Please proceed with caution, this cannot be undone.</p>
    </div>
    <AlertDialog.Root>
      <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>Delete account</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            {m.accounts.delete.destructiveOperation}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <Input
          type="text"
          bind:value={deleteConfirmationInput}
          placeholder={`Type "${CONFIRMATION_PHRASE}" to confirm`}
        />
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Back to safety</AlertDialog.Cancel>
          <AlertDialog.Action
            type="submit"
            form="delete-user-form"
            disabled={!isDeleteConfirmed}
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
</div>
