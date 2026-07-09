<script lang="ts">
  import {
    completePasswordChallenge,
    completeRecoveryChallenge,
    completeTotpChallenge
  } from '$remote/challenge.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { useRateLimitCountdown } from '$lib/hooks/use-rate-limit-countdown.svelte';
  import { useRemoteForm } from '$lib/hooks/use-remote-form';
  import { passwordChallengeSchema, recoveryChallengeSchema, totpChallengeSchema } from '$lib/validations/auth';

  import OtpCodeField from '$components/otp-code-field.svelte';
  import PasswordInput from '$components/password-input.svelte';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { ArrowRight, RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const formKey = $props.id();
  let code = $state('');
  let challenge = $state<'totp' | 'recovery'>('totp');

  const passwordForm = useRemoteForm(completePasswordChallenge, formKey, 'password').preflight(passwordChallengeSchema);
  const otpForm = useRemoteForm(completeTotpChallenge, formKey, 'otp').preflight(totpChallengeSchema);
  const recoveryForm = useRemoteForm(completeRecoveryChallenge, formKey, 'recovery').preflight(recoveryChallengeSchema);
  const passwordErrors = useRateLimitCountdown(() => passwordForm.fields._password.issues());
  const otpErrors = useRateLimitCountdown(() => otpForm.fields._code.issues());
  const recoveryErrors = useRateLimitCountdown(() => recoveryForm.fields._recoveryCode.issues());
  const loginRedirect = $derived(`/login?${new URLSearchParams({ next: data.next }).toString()}`);
  const title = $derived.by(() => {
    if (data.method === 'totp' && challenge === 'recovery') return 'Enter recovery code';
    if (data.method === 'totp') return 'Enter authentication code';
    if (data.method === 'session') return 'Sign in again';
    return 'Confirm your password';
  });
  const description = $derived.by(() => {
    if (data.method === 'totp' && challenge === 'recovery') return 'Use one of your saved recovery codes.';
    if (data.method === 'totp') return 'Use your authenticator app to continue.';
    if (data.method === 'session') return 'Your session needs to be refreshed before continuing.';
    return 'Re-enter your password to continue.';
  });
</script>

<section class="space-y-6">
  <header class="space-y-1.5">
    <h1 class="font-secondary text-[26px] leading-tight font-semibold tracking-tight">{title}</h1>
    <p class="text-sm text-muted-foreground">{description}</p>
  </header>

  {#if data.method === 'totp'}
    {#if challenge === 'recovery'}
      <form {...recoveryForm} {...useFormValidation(recoveryForm)} class="space-y-4!">
        <input {...recoveryForm.fields.next.as('hidden', data.next)} />

        <Field.Field class="gap-1.5">
          <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Recovery Code</Field.Label>
          <Input
            autofocus
            autocomplete="one-time-code"
            class="h-10 bg-background font-mono text-sm dark:bg-background"
            {...recoveryForm.fields._recoveryCode.as('text')}
          />
          <Field.Error errors={recoveryErrors()} />
        </Field.Field>

        <button
          type="submit"
          disabled={!!recoveryForm.pending}
          class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
        >
          {#if recoveryForm.pending}
            <RotateCw size="14" class="animate-spin" />
            Confirming
          {:else}
            Continue
            <ArrowRight size="14" class="transition-transform group-hover:translate-x-0.5" />
          {/if}
        </button>
      </form>
    {:else}
      <form {...otpForm} {...useFormValidation(otpForm)} class="space-y-4!">
        <input {...otpForm.fields.next.as('hidden', data.next)} />
        <input {...otpForm.fields._code.as('hidden', code)} />

        <OtpCodeField
          inputId="auth-challenge-code"
          bind:value={code}
          pending={!!otpForm.pending}
          errors={otpErrors()}
        />

        <button
          type="submit"
          disabled={!!otpForm.pending || code.length < 6}
          class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
        >
          {#if otpForm.pending}
            <RotateCw size="14" class="animate-spin" />
            Confirming
          {:else}
            Continue
            <ArrowRight size="14" class="transition-transform group-hover:translate-x-0.5" />
          {/if}
        </button>
      </form>
    {/if}

    <button
      type="button"
      class="w-full cursor-pointer border-0 bg-transparent p-0 text-center text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      onclick={() => (challenge = challenge === 'recovery' ? 'totp' : 'recovery')}
    >
      {challenge === 'recovery' ? 'Use authentication code' : 'Use recovery code'}
    </button>
  {:else if data.method === 'session'}
    <form method="POST" action="/logout" class="space-y-4">
      <input type="hidden" name="redirectTo" value={loginRedirect} />
      <button type="submit" class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}>
        Continue to sign in
        <ArrowRight size="14" class="transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  {:else}
    <form {...passwordForm} {...useFormValidation(passwordForm)} class="space-y-4!">
      <input {...passwordForm.fields.next.as('hidden', data.next)} />

      <Field.Field class="gap-1.5">
        <div class="flex items-baseline justify-between">
          <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Password</Field.Label>
          <button
            type="submit"
            form="reset-password-logout"
            aria-label="Sign out and reset password"
            class="cursor-pointer border-0 bg-transparent p-0 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Reset password
          </button>
        </div>
        <PasswordInput
          autofocus
          autocomplete="current-password"
          class="h-10 bg-background text-sm dark:bg-background"
          {...passwordForm.fields._password.as('password')}
        />
        <Field.Error errors={passwordErrors()} />
      </Field.Field>

      <button
        type="submit"
        disabled={!!passwordForm.pending}
        class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
      >
        {#if passwordForm.pending}
          <RotateCw size="14" class="animate-spin" />
          Confirming
        {:else}
          Continue
          <ArrowRight size="14" class="transition-transform group-hover:translate-x-0.5" />
        {/if}
      </button>
    </form>

    <form id="reset-password-logout" method="POST" action="/logout">
      <input type="hidden" name="redirectTo" value="/password" />
    </form>
  {/if}
</section>
