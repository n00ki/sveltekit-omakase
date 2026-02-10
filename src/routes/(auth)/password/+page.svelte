<script lang="ts">
  import { requestPasswordReset } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { requestPasswordResetSchema } from '$lib/validations/auth';

  import { buttonVariants } from '$components/ui/button';
  import * as Card from '$components/ui/card';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { RotateCw } from '@lucide/svelte';
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="font-secondary text-xl">Request Password Reset</Card.Title>
    <Card.Description>Enter your email below to receive a password reset link</Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form {...requestPasswordReset.preflight(requestPasswordResetSchema)} {...useFormValidation(requestPasswordReset)}>
      <Field.Field>
        <Field.Label>Email</Field.Label>
        <Input autocapitalize="none" autocorrect="off" {...requestPasswordReset.fields.email.as('email')} />
        <Field.Error errors={requestPasswordReset.fields.email.issues()} />
      </Field.Field>

      <button type="submit" disabled={!!requestPasswordReset.pending} class={buttonVariants({ class: 'my-2 w-full' })}>
        {#if requestPasswordReset.pending}
          <RotateCw size="16" class="mr-2 animate-spin" />
        {/if}
        Send
      </button>
    </form>
  </Card.Content>
</Card.Root>
