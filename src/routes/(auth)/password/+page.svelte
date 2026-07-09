<script lang="ts">
  import { requestPasswordReset } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { useRemoteForm } from '$lib/hooks/use-remote-form';
  import { requestPasswordResetSchema } from '$lib/validations/auth';

  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { ArrowLeft, ArrowRight, RotateCw } from '@lucide/svelte';

  const formKey = $props.id();
  const requestPasswordResetForm = useRemoteForm(requestPasswordReset, formKey).preflight(requestPasswordResetSchema);
</script>

<section class="space-y-6">
  <header class="space-y-1.5">
    <h1 class="font-secondary text-[26px] leading-tight font-semibold tracking-tight">Reset password</h1>
    <p class="text-sm text-muted-foreground">Enter your email and we'll send you a link to choose a new password.</p>
  </header>

  <form {...requestPasswordResetForm} {...useFormValidation(requestPasswordResetForm)} class="space-y-4!">
    <Field.Field class="gap-1.5">
      <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">Email</Field.Label>
      <Input
        autocapitalize="none"
        autocorrect="off"
        placeholder="you@example.com"
        class="h-10 bg-background text-sm dark:bg-background"
        {...requestPasswordResetForm.fields.email.as('email')}
      />
      <Field.Error errors={requestPasswordResetForm.fields.email.issues()} />
    </Field.Field>

    <button
      type="submit"
      disabled={!!requestPasswordResetForm.pending}
      class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
    >
      {#if requestPasswordResetForm.pending}
        <RotateCw size="14" class="animate-spin" />
        Sending link
      {:else}
        Send reset link
        <ArrowRight size="14" class="transition-transform group-hover:translate-x-0.5" />
      {/if}
    </button>
  </form>

  <a
    href="/login"
    class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
  >
    <ArrowLeft size="14" />
    Back to sign in
  </a>
</section>
