<script lang="ts">
  import { createUser } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { createUserSchema } from '$lib/validations/auth';

  import GoogleIcon from '$components/google-icon.svelte';
  import PasswordInput from '$components/password-input.svelte';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { ArrowRight, RotateCw } from '@lucide/svelte';

  const formId = $props.id();
  const createUserForm = createUser.for(formId).preflight(createUserSchema);

  let isRedirecting = $state(false);
</script>

<section class="space-y-6">
  <header class="space-y-1.5">
    <h1 class="font-secondary text-[26px] leading-tight font-semibold tracking-tight">Create your account</h1>
    <p class="text-sm text-muted-foreground">Enter your details below to create your account.</p>
  </header>

  <form {...createUserForm} {...useFormValidation(createUserForm)} class="space-y-4!">
    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Name</Field.Label>
      <Input
        autocomplete="name"
        placeholder="Ada Lovelace"
        class="h-10 bg-background text-sm dark:bg-background"
        {...createUserForm.fields.name.as('text')}
      />
      <Field.Error errors={createUserForm.fields.name.issues()} />
    </Field.Field>

    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Email</Field.Label>
      <Input
        autocapitalize="none"
        autocorrect="off"
        autocomplete="username"
        placeholder="you@example.com"
        class="h-10 bg-background text-sm dark:bg-background"
        {...createUserForm.fields.email.as('email')}
      />
      <Field.Error errors={createUserForm.fields.email.issues()} />
    </Field.Field>

    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Password</Field.Label>
      <PasswordInput
        autocomplete="new-password"
        class="h-10 bg-background text-sm dark:bg-background"
        {...createUserForm.fields._password.as('password')}
      />
      <Field.Error errors={createUserForm.fields._password.issues()} />
    </Field.Field>

    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Confirm password</Field.Label>
      <PasswordInput
        autocomplete="new-password"
        class="h-10 bg-background text-sm dark:bg-background"
        {...createUserForm.fields._passwordConfirmation.as('password')}
      />
      <Field.Error errors={createUserForm.fields._passwordConfirmation.issues()} />
    </Field.Field>

    <button
      type="submit"
      disabled={!!createUserForm.pending}
      class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
    >
      {#if createUserForm.pending}
        <RotateCw size="14" class="animate-spin" />
        Creating account
      {:else}
        Create account
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
    Already have an account?
    <a href="/login" class="font-medium text-foreground underline-offset-4 hover:underline">Sign in</a>
  </p>
</section>
