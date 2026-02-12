<script lang="ts">
  import { toast } from 'svelte-sonner';

  import { deleteUser, updateUser } from '$remote/user.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { imageFileUploader } from '$lib/state/upload-file.svelte';
  import { getAvatarUrl } from '$lib/utils/display';
  import { deleteUserSchema, updateUserSchema } from '$lib/validations/auth';
  import * as m from '$lib/messages';

  import * as Alert from '$components/ui/alert';
  import * as AlertDialog from '$components/ui/alert-dialog';
  import * as Avatar from '$components/ui/avatar';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';
  import { Separator } from '$components/ui/separator';

  import { CircleX, RefreshCw, RotateCw } from '@lucide/svelte';

  let { data } = $props();

  let avatarFileId = $state<string | null>(null);
  let userAvatarPreview = $derived(getAvatarUrl(data.user?.avatar));
  let deleteDialogOpen = $state(false);

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

  async function handleSubmit({
    form,
    data: formData,
    submit
  }: {
    form: HTMLFormElement;
    data: { firstName?: string; lastName?: string; imageFileId?: string };
    submit: () => Promise<void>;
  }) {
    const firstName = formData.firstName?.trim() || undefined;
    const lastName = formData.lastName?.trim() || undefined;

    const firstNameChanged = !!firstName && firstName !== data.user?.firstName;
    const lastNameChanged = !!lastName && lastName !== data.user?.lastName;
    const avatarChanged = !!formData.imageFileId;

    if (!firstNameChanged && !lastNameChanged && !avatarChanged) {
      toast.warning(m.settings.userProfile.edit.noChanges);
      return;
    }

    await submit();

    form.reset();
    updateUser.fields.set({
      firstName: '',
      lastName: '',
      imageFileId: ''
    });
    avatarFileId = null;
  }

  const CONFIRMATION_PHRASE = 'DELETE';
  let deleteConfirmationPhrase = $state('');
  let isDeleteConfirmed = $derived(deleteConfirmationPhrase === CONFIRMATION_PHRASE);

  function handleDeleteConfirmationKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      toast.info('Mysterious are the ways of the keyboard. Please click the button for confirmation.');
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

  <form {...updateUser.preflight(updateUserSchema).enhance(handleSubmit)} {...useFormValidation(updateUser)}>
    <input type="hidden" name="imageFileId" value={avatarFileId ?? ''} />

    <Field.Field>
      <Field.Label>Avatar</Field.Label>
      <Input type="file" accept="image/*" onchange={uploadAvatar} disabled={imageFileUploader.isUploading} />
    </Field.Field>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <Field.Field>
          <Field.Label>First name</Field.Label>
          <Input
            autocomplete="given-name"
            placeholder={data.user?.firstName}
            {...updateUser.fields.firstName.as('text')}
          />
          <Field.Error errors={updateUser.fields.firstName.issues()} />
        </Field.Field>
      </div>

      <div>
        <Field.Field>
          <Field.Label>Last name</Field.Label>
          <Input
            autocomplete="family-name"
            placeholder={data.user?.lastName}
            {...updateUser.fields.lastName.as('text')}
          />
          <Field.Error errors={updateUser.fields.lastName.issues()} />
        </Field.Field>
      </div>
    </div>

    <button
      type="submit"
      disabled={!!updateUser.pending}
      class={buttonVariants({ variant: 'secondary', class: 'my-2 w-full' })}
    >
      {#if updateUser.pending}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      Update Profile
    </button>
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
    <AlertDialog.Root bind:open={deleteDialogOpen}>
      <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>Delete account</AlertDialog.Trigger>
      <AlertDialog.Content>
        <form {...deleteUser.preflight(deleteUserSchema)}>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              {m.settings.userProfile.delete.destructiveOperation}
            </AlertDialog.Description>
          </AlertDialog.Header>
          <input type="hidden" name="_confirmation" value={deleteConfirmationPhrase} />
          <Input
            type="text"
            bind:value={deleteConfirmationPhrase}
            placeholder={`Type "${CONFIRMATION_PHRASE}" to confirm`}
            onkeydown={handleDeleteConfirmationKeydown}
          />
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Back to safety</AlertDialog.Cancel>
            <button
              type="submit"
              disabled={!isDeleteConfirmed || !!deleteUser.pending}
              class={buttonVariants({ variant: 'destructive' })}
            >
              {#if deleteUser.pending}
                <RotateCw size="16" class="mr-2 animate-spin" />
              {/if}
              Continue
            </button>
          </AlertDialog.Footer>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</div>
