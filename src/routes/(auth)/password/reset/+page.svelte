<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  import { passwordResetSchema } from '$lib/validations/auth';

  import * as Card from '$components/ui/card';
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';

  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(passwordResetSchema)
  });

  const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="font-secondary text-xl">Reset Your Password</Card.Title>
    <Card.Description>Enter a new password for <strong>{$formData.email}</strong></Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form method="POST" use:enhance>
      <Input name="token" type="hidden" aria-hidden="true" bind:value={$formData.token} />

      <Form.Field {form} name="password">
        {#snippet children({ constraints })}
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Password</Form.Label>
              <Input
                type="password"
                autocomplete="new-password"
                bind:value={$formData.password}
                {...props}
                {...constraints}
              />
              <Form.FieldErrors />
            {/snippet}
          </Form.Control>
        {/snippet}
      </Form.Field>

      <Form.Field {form} name="passwordConfirmation">
        {#snippet children({ constraints })}
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Password Confirmation</Form.Label>
              <Input
                type="password"
                autocomplete="new-password"
                bind:value={$formData.passwordConfirmation}
                {...props}
                {...constraints}
              />
              <Form.FieldErrors />
            {/snippet}
          </Form.Control>
        {/snippet}
      </Form.Field>

      <Form.Button disabled={$delayed} class="my-2 w-full">
        {#if $delayed}
          <RotateCw size="16" class="mr-2 animate-spin" />
        {/if}
        Reset
      </Form.Button>
    </form>
  </Card.Content>
</Card.Root>
