<script lang="ts">
  // Utils
  import type { FormOptions } from 'formsnap';
  import { resetPasswordSchema } from '$lib/validations/auth';
  import * as flashModule from 'sveltekit-flash-message/client';

  // Components
  import * as Form from '$lib/components/ui/form';
  import * as Card from '$lib/components/ui/card';

  // Assets
  import { Reload } from 'radix-icons-svelte';

  export let data;

  const options: FormOptions<typeof resetPasswordSchema> = {
    validators: resetPasswordSchema,
    delayMs: 500,
    multipleSubmits: 'prevent',
    syncFlashMessage: false,
    flashMessage: {
      module: flashModule
    }
  };
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Create a New Password</Card.Title>
    <Card.Description
      >Enter a new password for <strong>{data.form.data.email}</strong></Card.Description
    >
  </Card.Header>
  <Card.Content class="grid gap-4">
    <Form.Root
      method="POST"
      action="?/reset"
      form={data.form}
      schema={resetPasswordSchema}
      {options}
      let:config
      let:delayed
    >
      <Form.Field name="email" {config} let:value>
        <Form.Input type="hidden" value={value ?? ''} aria-hidden="true" required />
      </Form.Field>

      <Form.Field name="token" {config} let:value>
        <Form.Input type="hidden" value={value ?? ''} aria-hidden="true" required />
      </Form.Field>

      <Form.Field name="password" {config} let:constraints>
        <Form.Label>Password</Form.Label>
        <Form.Input type="password" {...constraints} />
        <Form.Validation />
      </Form.Field>

      <Form.Field name="passwordConfirmation" {config} let:constraints>
        <Form.Label>Password Confirmation</Form.Label>
        <Form.Input type="password" {...constraints} />
        <Form.Validation />
      </Form.Field>

      <Form.Button disabled={delayed} class="my-2 w-full">
        {#if delayed}
          <Reload class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Update Password
      </Form.Button>
    </Form.Root>
  </Card.Content>
</Card.Root>
