<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  import { getAvatarUrl } from '$lib/utils/helpers/image';
  import { imageFileUploader } from '$lib/utils/helpers/upload-file.svelte';
  import * as m from '$lib/utils/messages.json';
  import { editUserSchema } from '$lib/validations/auth';

  import * as Alert from '$components/ui/alert';
  import * as AlertDialog from '$components/ui/alert-dialog';
  import * as Avatar from '$components/ui/avatar';
  import { buttonVariants } from '$components/ui/button';
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import { Separator } from '$components/ui/separator';

  import { CircleX, RefreshCw, RotateCw } from '@lucide/svelte';

  let { data } = $props();

  let avatarFileId: string | null = null;

  let userAvatarPreview = $state(getAvatarUrl(data.user?.avatar));
  let isDeleting = $state(false);

  async function uploadAvatar(event: Event) {
    const avatarInputField: HTMLInputElement = event.target as HTMLInputElement;
    if (!avatarInputField.files) return;

    const upload = await imageFileUploader.upload(avatarInputField, 'images/avatars', 'avatar');

    if (upload) {
      if (!upload.errors && upload.fileId && upload.previewUrl) {
        avatarFileId = upload.fileId;
        userAvatarPreview = upload.previewUrl;
      }
    }
  }

  const form = superForm(data.form, {
    validators: zod4Client(editUserSchema),
    onSubmit: async ({ formData }) => {
      if (avatarFileId) {
        formData.set('avatarFileId', avatarFileId);
      } else {
        formData.delete('avatarFileId');
      }
    }
  });

  const { form: formData, delayed, enhance } = form;

  const CONFIRMATION_PHRASE = 'DELETE';
  let deleteConfirmationPhrase = $state('');
  let isDeleteConfirmed = $derived(deleteConfirmationPhrase === CONFIRMATION_PHRASE);

  function handleDeleteConfirmationKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && isDeleteConfirmed) {
      event.preventDefault();
      toast.info('Mysterious are the ways of the keyboard 🤷 Please click the button for confirmation.');
    }
  }
</script>

<div class="flex w-full flex-1 flex-col justify-center gap-4">
  <header>
    <h3 class="mb-0.5 text-base font-medium">Profile Settings</h3>
    <p class="text-xs tracking-tight text-muted-foreground">Update your profile information</p>
  </header>

  <div class="mx-auto my-2 flex size-32 rounded-full p-1 ring-4 ring-accent drop-shadow-xs">
    <div class="flex size-full items-center justify-center overflow-hidden rounded-full">
      {#if imageFileUploader.isUploading}
        <RefreshCw size="24" class="animate-spin" />
      {:else}
        <Avatar.Root class="size-full">
          <Avatar.Image src={userAvatarPreview} alt="user avatar preview" />
        </Avatar.Root>
      {/if}
    </div>
  </div>

  <form id="edit-user-form" method="POST" action="?/edit-user" enctype="multipart/form-data" use:enhance>
    <Form.Field {form} name="avatarFileId">
      {#snippet children({ constraints })}
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Avatar</Form.Label>
            <Input
              type="file"
              accept="image/*"
              onchange={uploadAvatar}
              disabled={imageFileUploader.isUploading}
              {...props}
              {...constraints}
            />
            <Form.FieldErrors />
          {/snippet}
        </Form.Control>
      {/snippet}
    </Form.Field>

    <div class="grid grid-cols-2 gap-4">
      <div class="grid gap-2">
        <Form.Field {form} name="firstName">
          {#snippet children({ constraints })}
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>First name</Form.Label>
                <Input
                  type="text"
                  autocomplete="given-name"
                  placeholder={data.user?.firstName}
                  bind:value={$formData.firstName}
                  {...props}
                  {...constraints}
                />
                <Form.FieldErrors />
              {/snippet}
            </Form.Control>
          {/snippet}
        </Form.Field>
      </div>

      <div class="grid gap-2">
        <Form.Field {form} name="lastName">
          {#snippet children({ constraints })}
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Last name</Form.Label>
                <Input
                  type="text"
                  autocomplete="family-name"
                  placeholder={data.user?.lastName}
                  bind:value={$formData.lastName}
                  {...props}
                  {...constraints}
                />
                <Form.FieldErrors />
              {/snippet}
            </Form.Control>
          {/snippet}
        </Form.Field>
      </div>
    </div>

    <Form.Button disabled={$delayed} variant="secondary" class="my-2 w-full">
      {#if $delayed}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      Update Profile
    </Form.Button>
  </form>

  {#if imageFileUploader.isFailed}
    <div class="space-y-2">
      {#each imageFileUploader.errors as error, index (index)}
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

  <h3 class="mb-2 text-base font-medium">Danger Zone</h3>
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
            {m.settings.userProfile.delete.destructiveOperation}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <Input
          type="text"
          bind:value={deleteConfirmationPhrase}
          placeholder={`Type "${CONFIRMATION_PHRASE}" to confirm`}
          onkeydown={handleDeleteConfirmationKeydown}
        />
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Back to safety</AlertDialog.Cancel>
          <AlertDialog.Action
            type="submit"
            form="delete-user-form"
            disabled={!isDeleteConfirmed}
            onclick={() => (isDeleting = true)}
            class="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
          >
            {#if isDeleting}
              <RotateCw size="16" class="mr-2 animate-spin" />
            {/if}
            Continue
            <form
              id="delete-user-form"
              action="?/delete-user"
              method="POST"
              class="mx-auto flex w-full flex-col items-center justify-center"
            ></form>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</div>
