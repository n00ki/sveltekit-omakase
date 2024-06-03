<script lang="ts">
  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { loginSchema } from '$lib/validations/auth';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import * as Card from '$components/ui/card';

  // Assets
  import { Reload } from 'svelte-radix';

  export let data;

  const form = superForm(data.form, {
    validators: zodClient(loginSchema)
  });

  const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <form method="POST" action="?/login" use:enhance>
        <div class="grid gap-2">
          <Form.Field {form} name="email" let:constraints>
            <Form.Control let:attrs>
              <Form.Label>Email</Form.Label>
              <Input
                type="email"
                autocapitalize="none"
                autocorrect="off"
                autocomplete="username"
                placeholder="email@example.com"
                bind:value={$formData.email}
                {...attrs}
                {...constraints}
              />
              <Form.FieldErrors />
            </Form.Control>
          </Form.Field>
        </div>
        <div class="grid gap-2">
          <Form.Field {form} name="password" let:constraints>
            <Form.Control let:attrs>
              <div class="flex items-center">
                <Form.Label>Password</Form.Label>
                <a href="/reset-password" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
              </div>
              <Input
                type="password"
                autocomplete="current-password"
                bind:value={$formData.password}
                {...attrs}
                {...constraints}
              />
              <Form.FieldErrors />
            </Form.Control>
          </Form.Field>
        </div>

        <Form.Button disabled={$delayed} class="my-2 w-full">
          {#if $delayed}
            <Reload class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Login
        </Form.Button>
      </form>
    </div>
    <div class="mt-4 text-center text-sm">
      Don&apos;t have an account?
      <a href="/register" class="underline"> Sign up </a>
    </div>
  </Card.Content>
</Card.Root>
