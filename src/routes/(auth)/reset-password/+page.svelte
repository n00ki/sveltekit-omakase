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
  import { Reload } from 'svelte-radix';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(requestPasswordResetSchema)
  });

  const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Request Password Reset</Card.Title>
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
          <Form.Description class="mt-1.5">We will send you a password reset link</Form.Description>
        {/snippet}
      </Form.Field>

      <Form.Button disabled={$delayed} class="my-2 w-full">
        {#if $delayed}
          <Reload class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Send
      </Form.Button>
    </form>
  </Card.Content>
</Card.Root>
