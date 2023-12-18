<script lang="ts">
  // Utils
  import type { FormOptions } from 'formsnap';
  import { requestPasswordResetSchema } from '$lib/validations/auth';
  import * as flashModule from 'sveltekit-flash-message/client';

  // Components
  import * as Form from '$lib/components/ui/form';
  import * as Card from '$lib/components/ui/card';

  // Assets
  import { Reload } from 'radix-icons-svelte';

  export let data;

  const options: FormOptions<typeof requestPasswordResetSchema> = {
    validators: requestPasswordResetSchema,
    invalidateAll: true,
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
    <Card.Title class="text-2xl">Request Password Reset</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <Form.Root
      method="POST"
      action="?/requestPasswordReset"
      form={data.form}
      schema={requestPasswordResetSchema}
      {options}
      let:config
      let:delayed
    >
      <Form.Field name="email" {config} let:constraints>
        <Form.Label>Email</Form.Label>
        <Form.Input type="email" autocapitalize="none" autocorrect="off" {...constraints} />
        <Form.Description class="mt-1.5">We will send you a password reset link</Form.Description>
        <Form.Validation />
      </Form.Field>

      <Form.Button disabled={delayed} class="my-2 w-full">
        {#if delayed}
          <Reload class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Send
      </Form.Button>
    </Form.Root>
  </Card.Content>
</Card.Root>
