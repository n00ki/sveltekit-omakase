<script lang="ts">
  import { updateUserPassword } from '$remote/user.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { updateUserPasswordSchema } from '$lib/validations/auth';

  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const hasCredential = $derived(data.hasCredentialAccount);

  async function handleSubmit({ form, submit }: { form: HTMLFormElement; submit: () => Promise<void> }) {
    await submit();
    form.reset();
    updateUserPassword.fields.set({
      _currentPassword: '',
      _password: '',
      _passwordConfirmation: ''
    });
  }
</script>

<div class="flex w-full flex-1 flex-col justify-center gap-4">
  <header>
    <h3 class="mb-0.5 text-base font-medium">Password Settings</h3>
    <p class="text-xs tracking-tight text-muted-foreground">
      {hasCredential ? 'Update your password' : 'Set a password for your account'}
    </p>
  </header>

  <form
    {...updateUserPassword.preflight(updateUserPasswordSchema).enhance(handleSubmit)}
    {...useFormValidation(updateUserPassword)}
  >
    {#if hasCredential}
      <div>
        <Field.Field>
          <Field.Label>Current Password</Field.Label>
          <Input
            autocomplete="current-password"
            placeholder="********"
            {...updateUserPassword.fields._currentPassword.as('password')}
          />
          <Field.Error errors={updateUserPassword.fields._currentPassword.issues()} />
        </Field.Field>
      </div>
    {/if}

    <div>
      <Field.Field>
        <Field.Label>New Password</Field.Label>
        <Input
          autocomplete="new-password"
          placeholder="********"
          {...updateUserPassword.fields._password.as('password')}
        />
        <Field.Error errors={updateUserPassword.fields._password.issues()} />
      </Field.Field>
    </div>

    <div>
      <Field.Field>
        <Field.Label>Confirm Password</Field.Label>
        <Input
          autocomplete="new-password"
          placeholder="********"
          {...updateUserPassword.fields._passwordConfirmation.as('password')}
        />
        <Field.Error errors={updateUserPassword.fields._passwordConfirmation.issues()} />
      </Field.Field>
    </div>

    <button
      type="submit"
      disabled={!!updateUserPassword.pending}
      class={buttonVariants({ variant: 'secondary', class: 'my-2 w-full' })}
    >
      {#if updateUserPassword.pending}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      {hasCredential ? 'Update Password' : 'Set Password'}
    </button>
  </form>
</div>
