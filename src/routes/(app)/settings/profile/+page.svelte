<script lang="ts">
  import type { PageData } from './$types';

  import { toast } from 'svelte-sonner';

  import { deleteUser, updateUser } from '$remote/user.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { FileUploader, uploads } from '$lib/upload';
  import { getAvatarUrl } from '$lib/utils/display';
  import { normalizeFullName } from '$lib/utils/name';
  import { cn } from '$lib/utils/utils';
  import { deleteUserSchema, updateUserSchema } from '$lib/validations/auth';
  import * as m from '$lib/messages';

  import * as Alert from '$components/ui/alert';
  import * as Avatar from '$components/ui/avatar';
  import { Button, buttonVariants } from '$components/ui/button';
  import * as Dialog from '$components/ui/dialog';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';
  import { Separator } from '$components/ui/separator';

  import { CircleX, RefreshCw, RotateCw } from '@lucide/svelte';

  let { data }: { data: PageData } = $props();

  const avatarUploader: FileUploader = new FileUploader(uploads.avatar);
  const formId = $props.id();
  const profileForm = updateUser.for(`${formId}-profile`).preflight(updateUserSchema);
  const deleteAccountForm = deleteUser.for(`${formId}-delete`).preflight(deleteUserSchema);
  let avatarFileId = $state<string | null>(null);
  let userAvatarPreview = $derived(getAvatarUrl(data.user?.avatar));
  let deleteDialogOpen = $state(false);

  async function uploadAvatar(event: Event): Promise<void> {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const upload = await avatarUploader.upload(file);

    if (!upload.success) {
      input.value = '';
      return;
    }

    avatarFileId = upload.file.id;
    profileForm.fields.imageFileId.set(upload.file.id);
    userAvatarPreview = upload.file.url;
  }

  const profileFormProps = profileForm.enhance(async (form) => {
    const formName = form.fields.name.value();
    const imageFileId = form.fields.imageFileId.value();
    const name = typeof formName === 'string' ? normalizeFullName(formName) || undefined : undefined;

    const nameChanged = !!name && name !== data.user?.name;
    const avatarChanged = !!imageFileId;

    if (!nameChanged && !avatarChanged) {
      toast.warning(m.settings.userProfile.edit.noChanges);
      return;
    }

    const isSuccessful = await form.submit();

    if (!isSuccessful) return;

    form.element.reset();
    form.fields.set({
      name: '',
      imageFileId: ''
    });
    avatarFileId = null;
  });

  const CONFIRMATION_PHRASE: string = 'DELETE';
  const destructiveButtonClass: string =
    'bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60 dark:hover:bg-destructive/70';

  let isDeleteConfirmed = $derived(deleteAccountForm.fields._confirmation.value() === CONFIRMATION_PHRASE);

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
      {#if avatarUploader.isUploading}
        <RefreshCw size="24" class="animate-spin" />
      {:else}
        <Avatar.Root class="size-full">
          <Avatar.Image src={userAvatarPreview} alt="user avatar preview" />
        </Avatar.Root>
      {/if}
    </div>
  </div>

  <form {...profileFormProps} {...useFormValidation(profileForm)}>
    <input {...profileForm.fields.imageFileId.as('hidden', avatarFileId ?? '')} />

    <Field.Field>
      <Field.Label>Avatar</Field.Label>
      <Input type="file" accept={avatarUploader.accept} onchange={uploadAvatar} disabled={avatarUploader.isUploading} />
      <Field.Error errors={profileForm.fields.imageFileId.issues()} />
    </Field.Field>

    <Field.Field>
      <Field.Label>Name</Field.Label>
      <Input autocomplete="name" placeholder={data.user?.name} {...profileForm.fields.name.as('text')} />
      <Field.Error errors={profileForm.fields.name.issues()} />
    </Field.Field>

    <button
      type="submit"
      disabled={!!profileForm.pending}
      class={buttonVariants({ variant: 'secondary', class: 'my-2 w-full' })}
    >
      {#if profileForm.pending}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      Update Profile
    </button>
  </form>

  {#if avatarUploader.isFailed}
    <div class="space-y-2">
      {#each avatarUploader.errors as error, index (index)}
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
    <Dialog.Root bind:open={deleteDialogOpen}>
      <Dialog.Trigger class={cn(buttonVariants({ variant: 'destructive' }), destructiveButtonClass)}>
        Delete account
      </Dialog.Trigger>
      <Dialog.Content class="sm:max-w-lg">
        <form {...deleteAccountForm} class="space-y-6">
          <Dialog.Header>
            <Dialog.Title>Are you absolutely sure?</Dialog.Title>
            <Dialog.Description>{m.settings.userProfile.delete.destructiveOperation}</Dialog.Description>
          </Dialog.Header>
          <div class="grid gap-2">
            <Input
              placeholder={`Type "${CONFIRMATION_PHRASE}" to confirm`}
              onkeydown={handleDeleteConfirmationKeydown}
              {...deleteAccountForm.fields._confirmation.as('text')}
            />
            <Field.Error errors={deleteAccountForm.fields._confirmation.issues()} />
          </div>
          <Dialog.Footer class="gap-2">
            <Dialog.Close type="button" class={buttonVariants({ variant: 'secondary' })}>Back to safety</Dialog.Close>
            <Button
              type="submit"
              variant="destructive"
              class={destructiveButtonClass}
              disabled={!isDeleteConfirmed || !!deleteAccountForm.pending}
            >
              {#if deleteAccountForm.pending}
                <RotateCw size="16" class="mr-2 animate-spin" />
              {/if}
              Continue
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</div>
