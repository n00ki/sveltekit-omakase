<script lang="ts">
  import type { PageData } from './$types';

  import { updateUserPassword } from '$remote/user.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { updateUserPasswordSchema } from '$lib/validations/auth';

  import PasswordInput from '$components/password-input.svelte';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';

  import { RotateCw } from '@lucide/svelte';

  let { data }: { data: PageData } = $props();

  const hasCredential = $derived(data.hasCredentialAccount);
  const formId = $props.id();
  const passwordForm = updateUserPassword.for(formId).preflight(updateUserPasswordSchema);

  const passwordFormProps = passwordForm.enhance(async (form) => {
    const isSuccessful = await form.submit();

    if (!isSuccessful) return;

    form.element.reset();
    form.fields.set({
      _currentPassword: '',
      _password: '',
      _passwordConfirmation: ''
    });
  });
</script>

<div class="flex w-full flex-1 flex-col justify-center gap-4">
  <header>
    <h3 class="mb-0.5 text-base font-medium">Password Settings</h3>
    <p class="text-xs tracking-tight text-muted-foreground">
      {hasCredential ? 'Update your password' : 'Set a password for your account'}
    </p>
  </header>

  <form {...passwordFormProps} {...useFormValidation(passwordForm)}>
    {#if hasCredential}
      <div>
        <Field.Field>
          <Field.Label>Current Password</Field.Label>
          <PasswordInput
            autocomplete="current-password"
            placeholder="********"
            {...passwordForm.fields._currentPassword.as('password')}
          />
          <Field.Error errors={passwordForm.fields._currentPassword.issues()} />
        </Field.Field>
      </div>
    {/if}

    <div>
      <Field.Field>
        <Field.Label>New Password</Field.Label>
        <PasswordInput
          autocomplete="new-password"
          placeholder="********"
          {...passwordForm.fields._password.as('password')}
        />
        <Field.Error errors={passwordForm.fields._password.issues()} />
      </Field.Field>
    </div>

    <div>
      <Field.Field>
        <Field.Label>Confirm Password</Field.Label>
        <PasswordInput
          autocomplete="new-password"
          placeholder="********"
          {...passwordForm.fields._passwordConfirmation.as('password')}
        />
        <Field.Error errors={passwordForm.fields._passwordConfirmation.issues()} />
      </Field.Field>
    </div>

    <button
      type="submit"
      disabled={!!passwordForm.pending}
      class={buttonVariants({ variant: 'secondary', class: 'my-2 w-full' })}
    >
      {#if passwordForm.pending}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      {hasCredential ? 'Update Password' : 'Set Password'}
    </button>
  </form>
</div>
