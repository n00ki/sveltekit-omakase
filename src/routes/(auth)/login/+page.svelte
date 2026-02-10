<script lang="ts">
  import { login } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { useRateLimitCountdown } from '$lib/hooks/use-rate-limit-countdown.svelte';
  import { loginSchema } from '$lib/validations/auth';

  import { buttonVariants } from '$components/ui/button';
  import * as Card from '$components/ui/card';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { RotateCw } from '@lucide/svelte';

  let isRedirecting = $state(false);

  const emailErrors = useRateLimitCountdown(() => login.fields.email.issues());
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="font-secondary text-xl">Login</Card.Title>
    <Card.Description>Enter your email and password below to log in</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <form {...login.preflight(loginSchema)} {...useFormValidation(login)}>
        <div>
          <Field.Field>
            <Field.Label>Email</Field.Label>
            <Input
              autocapitalize="none"
              autocorrect="off"
              autocomplete="username"
              placeholder="email@example.com"
              {...login.fields.email.as('email')}
            />
            <Field.Error errors={emailErrors()} />
          </Field.Field>
        </div>
        <div>
          <Field.Field>
            <div class="flex items-center">
              <Field.Label>Password</Field.Label>
              <a href="/password" class="ml-auto inline-block text-sm underline">Forgot your password?</a>
            </div>
            <Input autocomplete="current-password" {...login.fields._password.as('password')} />
            <Field.Error errors={login.fields._password.issues()} />
          </Field.Field>
        </div>

        <button type="submit" disabled={!!login.pending} class={buttonVariants({ class: 'my-2 w-full' })}>
          {#if login.pending}
            <RotateCw size="16" class="mr-2 animate-spin" />
          {/if}
          Login
        </button>
      </form>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t transition-colors"></span>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground transition-colors"> Or continue with </span>
        </div>
      </div>
      <a
        class={buttonVariants({
          variant: 'outline',
          class: isRedirecting ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
        })}
        onclick={() => (isRedirecting = true)}
        href="/login/google"
        data-sveltekit-reload
      >
        {#if isRedirecting}
          <RotateCw size="16" class="mr-2 animate-spin" />
        {/if}
        Google
      </a>
    </div>

    <div class="mt-4 text-center text-sm">
      Don&apos;t have an account?
      <a href="/register" class="underline"> Sign up </a>
    </div>
  </Card.Content>
</Card.Root>
