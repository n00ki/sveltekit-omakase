<script lang="ts">
  import { login } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { useRateLimitCountdown } from '$lib/hooks/use-rate-limit-countdown.svelte';
  import { loginSchema } from '$lib/validations/auth';

  import GoogleIcon from '$components/google-icon.svelte';
  import PasswordInput from '$components/password-input.svelte';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { ArrowRight, RotateCw } from '@lucide/svelte';

  const formId = $props.id();
  const loginForm = login.for(formId).preflight(loginSchema);
  const emailErrors = useRateLimitCountdown(() => loginForm.fields.email.issues());

  let isRedirecting = $state(false);
</script>

<section class="space-y-6">
  <header class="space-y-1.5">
    <h1 class="font-secondary text-[26px] leading-tight font-semibold tracking-tight">Welcome back</h1>
    <p class="text-sm text-muted-foreground">Enter your email and password below to log in.</p>
  </header>

  <form {...loginForm} {...useFormValidation(loginForm)} class="space-y-4!">
    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Email</Field.Label>
      <Input
        autocapitalize="none"
        autocorrect="off"
        autocomplete="username"
        placeholder="you@example.com"
        class="h-10 bg-background text-sm dark:bg-background"
        {...loginForm.fields.email.as('email')}
      />
      <Field.Error errors={emailErrors()} />
    </Field.Field>

    <Field.Field class="gap-1.5">
      <div class="flex items-baseline justify-between">
        <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Password</Field.Label>
        <a
          href="/password"
          class="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Forgot password?
        </a>
      </div>
      <PasswordInput
        autocomplete="current-password"
        class="h-10 bg-background text-sm dark:bg-background"
        {...loginForm.fields._password.as('password')}
      />
      <Field.Error errors={loginForm.fields._password.issues()} />
    </Field.Field>

    <button
      type="submit"
      disabled={!!loginForm.pending}
      class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
    >
      {#if loginForm.pending}
        <RotateCw size="14" class="animate-spin" />
        Signing in
      {:else}
        Sign in
        <ArrowRight size="14" class="transition-transform group-hover:translate-x-0.5" />
      {/if}
    </button>
  </form>

  <div class="flex items-center gap-3 text-[11px] tracking-tight text-muted-foreground uppercase">
    <span class="h-px flex-1 bg-border"></span>
    <span>or</span>
    <span class="h-px flex-1 bg-border"></span>
  </div>

  <a
    class={buttonVariants({
      variant: 'outline',
      class: ['h-10 w-full gap-2.5', isRedirecting && 'pointer-events-none cursor-not-allowed opacity-50']
    })}
    onclick={() => (isRedirecting = true)}
    href="/login/google"
    data-sveltekit-reload
  >
    {#if isRedirecting}
      <RotateCw size="14" class="animate-spin" />
    {:else}
      <GoogleIcon />
    {/if}
    Continue with Google
  </a>

  <p class="text-center text-sm text-muted-foreground">
    Don't have an account?
    <a href="/register" class="font-medium text-foreground underline-offset-4 hover:underline">Sign up</a>
  </p>
</section>
