<script lang="ts">
  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { resetPasswordSchema } from '$lib/validations/auth';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import * as Card from '$components/ui/card';

  // Assets
  import { Reload } from 'svelte-radix';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(resetPasswordSchema)
  });

  const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Create a New Password</Card.Title>
    <Card.Description
      >Enter a new password for <strong>{data.form.data.email}</strong></Card.Description
    >
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form method="POST" action="?/reset" use:enhance>
      <Input name="email" type="hidden" aria-hidden="true" bind:value={$formData.email} />

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
          <Reload class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Reset
      </Form.Button>
    </form>
  </Card.Content>
</Card.Root>
