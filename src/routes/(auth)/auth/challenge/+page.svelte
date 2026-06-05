<script lang="ts">
  import type { PageData } from './$types';

  import { completeChallenge } from '$remote/challenge.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { useRateLimitCountdown } from '$lib/hooks/use-rate-limit-countdown.svelte';
  import { challengeSchema } from '$lib/validations/auth';

  import PasswordInput from '$components/password-input.svelte';
  import { buttonVariants } from '$components/ui/button';
  import * as Field from '$components/ui/field';

  import { ArrowRight, RotateCw } from '@lucide/svelte';

  let { data }: { data: PageData } = $props();

  const formId = $props.id();
  const challengeForm = completeChallenge.for(formId).preflight(challengeSchema);
  const passwordErrors = useRateLimitCountdown(() => challengeForm.fields._password.issues());
</script>

<section class="space-y-6">
  <header class="space-y-1.5">
    <h1 class="font-secondary text-[26px] leading-tight font-semibold tracking-tight">Confirm your password</h1>
    <p class="text-sm text-muted-foreground">Re-enter your password to continue.</p>
  </header>

  <form {...challengeForm} {...useFormValidation(challengeForm)} class="space-y-4!">
    <input {...challengeForm.fields.next.as('hidden', data.next)} />

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
        {...challengeForm.fields._password.as('password')}
      />
      <Field.Error errors={passwordErrors()} />
    </Field.Field>

    <button
      type="submit"
      disabled={!!challengeForm.pending}
      class={buttonVariants({ class: 'group mt-1 h-10 w-full gap-1.5' })}
    >
      {#if challengeForm.pending}
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
</section>
