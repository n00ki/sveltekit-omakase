<script lang="ts">
  // Utils
  import type { FormOptions } from 'formsnap';
  import { registrationSchema } from '$lib/validations/auth';
  import * as flashModule from 'sveltekit-flash-message/client';

  // Components
  import * as Form from '$lib/components/ui/form';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';

  // Assets
  import { Reload, GithubLogo, LinkedinLogo } from 'radix-icons-svelte';

  export let data;

  const options: FormOptions<typeof registrationSchema> = {
    validators: registrationSchema,
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
    <Card.Title class="text-2xl">Create an account</Card.Title>
    <Card.Description>Enter your email below to create your account</Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="grid grid-cols-2 gap-6">
      <Button variant="outline">
        <GithubLogo class="mr-2 h-4 w-4" />
        Github
      </Button>
      <Button variant="outline">
        <LinkedinLogo class="mr-2 h-4 w-4" />
        LinkedIn
      </Button>
    </div>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-card px-2 text-muted-foreground"> Or continue with </span>
      </div>
    </div>
    <Form.Root
      method="POST"
      action="?/register"
      form={data.form}
      schema={registrationSchema}
      {options}
      let:config
      let:delayed
    >
      <Form.Field name="email" {config} let:constraints>
        <Form.Label>Email</Form.Label>
        <Form.Input type="email" autocapitalize="none" autocorrect="off" {...constraints} />
        <Form.Validation />
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
        Register
      </Form.Button>
    </Form.Root>
  </Card.Content>
</Card.Root>
