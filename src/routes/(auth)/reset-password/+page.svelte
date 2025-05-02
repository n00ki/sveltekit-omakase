<script lang="ts">
  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { requestPasswordResetSchema } from '$lib/validations/auth';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import * as Card from '$components/ui/card';

  // Assets
  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(requestPasswordResetSchema)
  });

  const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="font-secondary text-xl">Request Password Reset</Card.Title>
    <Card.Description>Enter your email below to receive a password reset link</Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form method="POST" action="?/requestPasswordReset" use:enhance>
      <Form.Field {form} name="email">
        {#snippet children({ constraints })}
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Email</Form.Label>
              <Input
                type="email"
                autocapitalize="none"
                autocorrect="off"
                bind:value={$formData.email}
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
        Send
      </Form.Button>
    </form>
  </Card.Content>
</Card.Root>
