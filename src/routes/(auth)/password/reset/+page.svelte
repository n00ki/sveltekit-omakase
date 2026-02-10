<script lang="ts">
  import { resetUserPassword } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { resetUserPasswordSchema } from '$lib/validations/auth';

  import { buttonVariants } from '$components/ui/button';
  import * as Card from '$components/ui/card';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="font-secondary text-xl">Reset Your Password</Card.Title>
    <Card.Description>Enter a new password for <strong>{data.email}</strong></Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form {...resetUserPassword.preflight(resetUserPasswordSchema)} {...useFormValidation(resetUserPassword)}>
      <input type="hidden" name="token" value={data.token} />

      <Field.Field>
        <Field.Label>Password</Field.Label>
        <Input autocomplete="new-password" {...resetUserPassword.fields._password.as('password')} />
        <Field.Error errors={resetUserPassword.fields._password.issues()} />
      </Field.Field>

      <Field.Field>
        <Field.Label>Password Confirmation</Field.Label>
        <Input autocomplete="new-password" {...resetUserPassword.fields._passwordConfirmation.as('password')} />
        <Field.Error errors={resetUserPassword.fields._passwordConfirmation.issues()} />
      </Field.Field>

      <button type="submit" disabled={!!resetUserPassword.pending} class={buttonVariants({ class: 'my-2 w-full' })}>
        {#if resetUserPassword.pending}
          <RotateCw size="16" class="mr-2 animate-spin" />
        {/if}
        Reset
      </button>
    </form>
  </Card.Content>
</Card.Root>
