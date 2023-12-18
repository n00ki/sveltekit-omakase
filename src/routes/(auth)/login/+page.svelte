<script lang="ts">
  // Utils
  import type { FormOptions } from 'formsnap';
  import { loginSchema } from '$lib/validations/auth';
  import * as flashModule from 'sveltekit-flash-message/client';

  // Components
  import * as Form from '$lib/components/ui/form';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';

  // Assets
  import { Reload, GithubLogo, LinkedinLogo } from 'radix-icons-svelte';

  export let data;

  const options: FormOptions<typeof loginSchema> = {
    validators: loginSchema,
    invalidateAll: true,
    delayMs: 500,
    validationMethod: 'submit-only',
    multipleSubmits: 'prevent',
    syncFlashMessage: false,
    flashMessage: {
      module: flashModule
    },
    onResult({ formEl }) {
      setTimeout(() => {
        formEl.querySelector('input')?.focus();
      }, 50);
    }
  };
</script>

<Card.Root>
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description>Enter your email and password below to access your account</Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <Form.Root
      method="POST"
      action="?/login"
      form={data.form}
      schema={loginSchema}
      {options}
      let:config
      let:delayed
    >
      <Form.Field name="email" {config} let:constraints>
        <Form.Label>Email</Form.Label>
        <Form.Input
          id="email"
          type="email"
          autocapitalize="none"
          autocorrect="off"
          {...constraints}
        />
        <Form.Validation />
      </Form.Field>

      <Form.Field name="password" {config} let:constraints>
        <Form.Label>Password</Form.Label>
        <Form.Input type="password" {...constraints} />
        <Form.Validation />
      </Form.Field>

      <Form.Button disabled={delayed} class="my-2 w-full">
        {#if delayed}
          <Reload class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Sign In
      </Form.Button>
    </Form.Root>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-card px-2 text-muted-foreground"> Or continue with </span>
      </div>
    </div>

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
  </Card.Content>
  <Card.Footer>
    <div class="mt-2 flex w-full justify-between">
      <a href="/reset-password" class="text-xs">Forgot your password?</a>
      <a href="/register" class="text-xs">Doesn't have an account yet?</a>
    </div>
  </Card.Footer>
</Card.Root>
