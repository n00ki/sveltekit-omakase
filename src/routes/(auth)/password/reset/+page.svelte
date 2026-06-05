<script lang="ts">
  import { resetUserPassword } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { resetUserPasswordSchema } from '$lib/validations/auth';

  import PasswordInput from '$components/password-input.svelte';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';

  import { ArrowRight, RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const formId = $props.id();
  const resetUserPasswordForm = resetUserPassword.for(formId).preflight(resetUserPasswordSchema);
</script>

<section class="space-y-6">
  <header class="space-y-1.5">
    <h1 class="font-secondary text-[26px] leading-tight font-semibold tracking-tight">Choose a new password</h1>
    <p class="text-sm text-muted-foreground">
      Resetting password for
      <span class="font-medium text-foreground">{data.email}</span>.
    </p>
  </header>

  <form {...resetUserPasswordForm} {...useFormValidation(resetUserPasswordForm)} class="space-y-4!">
    <input {...resetUserPasswordForm.fields.token.as('hidden', data.token)} />
    <Field.Error errors={resetUserPasswordForm.fields.token.issues()} />

    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">New password</Field.Label>
      <PasswordInput
        autocomplete="new-password"
        class="h-10 bg-background text-sm dark:bg-background"
        {...resetUserPasswordForm.fields._password.as('password')}
      />
      <Field.Error errors={resetUserPasswordForm.fields._password.issues()} />
    </Field.Field>

    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Confirm password</Field.Label>
      <PasswordInput
        autocomplete="new-password"
        class="h-10 bg-background text-sm dark:bg-background"
        {...resetUserPasswordForm.fields._passwordConfirmation.as('password')}
      />
      <Field.Error errors={resetUserPasswordForm.fields._passwordConfirmation.issues()} />
    </Field.Field>

    <button
      type="submit"
      disabled={!!resetUserPasswordForm.pending}
      class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
    >
      {#if resetUserPasswordForm.pending}
        <RotateCw size="14" class="animate-spin" />
        Updating
      {:else}
        Update password
        <ArrowRight size="14" class="transition-transform group-hover:translate-x-0.5" />
      {/if}
    </button>
  </form>
</section>
