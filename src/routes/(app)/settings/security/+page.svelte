<script lang="ts">
  import { page } from '$app/state';

  import { getFlash } from 'sveltekit-flash-message/client';

  import { disableTwoFactor, startTwoFactorSetup } from '$remote/two-factor.remote';
  import { updateUserPassword } from '$remote/user.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { updateUserPasswordSchema } from '$lib/validations/auth';

  import PasswordInput from '$components/password-input.svelte';
  import TwoFactorRecoveryCodes from '$components/two-factor-recovery-codes.svelte';
  import TwoFactorSetupModal from '$components/two-factor-setup-modal.svelte';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';

  import { RotateCw } from '@lucide/svelte';

  import * as m from '$messages';

  let { data } = $props();

  const flash = getFlash(page);
  const formId = $props.id();

  let passwordFormKey = $state(0);
  const passwordFormId = $derived(`${formId}-password-${passwordFormKey}`);
  const passwordForm = $derived(updateUserPassword.for(passwordFormId).preflight(updateUserPasswordSchema));
  const passwordSuccessMessage = $derived(
    data.hasCredentialAccount ? m.settings.security.password.success.update : m.settings.security.password.success.set
  );

  const enhancedPasswordForm = $derived(
    passwordForm.enhance(async (form) => {
      const successful = await form.submit();

      if (!successful) return;

      $flash = { type: 'success', message: passwordSuccessMessage };

      form.element.reset();
      passwordFormKey += 1;
    })
  );

  const setupForm = startTwoFactorSetup.for(`${formId}-two-factor-start`);
  const disableForm = disableTwoFactor.for(`${formId}-two-factor-disable`);
  let twoFactorSetup = $state(setupForm.result ?? null);
  const open = $derived(!!twoFactorSetup);

  const enhancedSetupForm = setupForm.enhance(async (form) => {
    const successful = await form.submit();

    if (!successful) return;

    twoFactorSetup = setupForm.result ?? null;
    form.element.reset();
  });

  function handleSetupOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      twoFactorSetup = null;
    }
  }
</script>

<div class="flex w-full flex-1 flex-col justify-center gap-8">
  <header>
    <h3 class="mb-0.5 text-base font-medium">Security Settings</h3>
    <p class="text-xs tracking-tight text-muted-foreground">Manage account access and sign-in security.</p>
  </header>

  <section class="space-y-4">
    <header>
      <h4 class="text-sm font-medium">Password</h4>
      <p class="text-xs text-muted-foreground">
        {data.hasCredentialAccount ? 'Update your password' : 'Set a password for your account'}
      </p>
    </header>

    {#key passwordFormId}
      <form {...passwordForm} {...enhancedPasswordForm} {...useFormValidation(passwordForm)}>
        <Field.Field>
          <Field.Label>New Password</Field.Label>
          <PasswordInput
            autocomplete="new-password"
            placeholder="********"
            {...passwordForm.fields._password.as('password')}
          />
          <Field.Error errors={passwordForm.fields._password.issues()} />
        </Field.Field>

        <Field.Field>
          <Field.Label>Confirm Password</Field.Label>
          <PasswordInput
            autocomplete="new-password"
            placeholder="********"
            {...passwordForm.fields._passwordConfirmation.as('password')}
          />
          <Field.Error errors={passwordForm.fields._passwordConfirmation.issues()} />
        </Field.Field>

        <button
          type="submit"
          disabled={!!passwordForm.pending}
          class={buttonVariants({ variant: 'secondary', class: 'my-2 w-full' })}
        >
          {#if passwordForm.pending}
            <RotateCw size="16" class="mr-2 animate-spin" />
          {/if}
          {data.hasCredentialAccount ? 'Update Password' : 'Set Password'}
        </button>
      </form>
    {/key}
  </section>

  <section class="space-y-4">
    <header>
      <h4 class="text-sm font-medium">Two-Factor Authentication</h4>
      <p class="text-xs text-muted-foreground">Add a one-time code requirement during sign in.</p>
    </header>

    {#if !data.twoFactorEnabled}
      <div class="space-y-4">
        <form {...setupForm} {...enhancedSetupForm}>
          <button type="submit" disabled={!!setupForm.pending} class={buttonVariants()}>
            {#if setupForm.pending}
              <RotateCw size="16" class="mr-2 animate-spin" />
            {/if}
            Enable 2FA
          </button>
        </form>
      </div>
    {:else}
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          You will be prompted for a secure code from your authenticator app during login.
        </p>

        <form {...disableForm}>
          <button type="submit" disabled={!!disableForm.pending} class={buttonVariants({ variant: 'destructive' })}>
            {#if disableForm.pending}
              <RotateCw size="16" class="mr-2 animate-spin" />
            {/if}
            Disable 2FA
          </button>
        </form>

        <TwoFactorRecoveryCodes />
      </div>
    {/if}
  </section>

  <TwoFactorSetupModal {open} setup={twoFactorSetup} onOpenChange={handleSetupOpenChange} />
</div>
