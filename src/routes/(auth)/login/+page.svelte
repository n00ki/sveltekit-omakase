<script lang="ts">
  // Utils
  import { buttonVariants } from '$components/ui/button';
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  // Schemas
  import { loginSchema } from '$lib/validations/auth';

  // Components
  import * as Card from '$components/ui/card';
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';

  // Assets
  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(loginSchema)
  });

  const { form: formData, enhance, delayed } = form;

  let isRedirecting = $state(false);
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="font-secondary text-xl">Login</Card.Title>
    <Card.Description>Enter your email and password below to log in</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <form method="POST" use:enhance>
        <div class="grid gap-2">
          <Form.Field {form} name="email">
            {#snippet children({ constraints })}
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Email</Form.Label>
                  <Input
                    type="email"
                    autocapitalize="none"
                    autocorrect="off"
                    autocomplete="username"
                    placeholder="email@example.com"
                    bind:value={$formData.email}
                    {...props}
                    {...constraints}
                  />
                  <Form.FieldErrors />
                {/snippet}
              </Form.Control>
            {/snippet}
          </Form.Field>
        </div>
        <div class="grid gap-2">
          <Form.Field {form} name="password">
            {#snippet children({ constraints })}
              <Form.Control>
                {#snippet children({ props })}
                  <div class="flex items-center">
                    <Form.Label>Password</Form.Label>
                    <a href="/password" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
                  </div>
                  <Input
                    type="password"
                    autocomplete="current-password"
                    bind:value={$formData.password}
                    {...props}
                    {...constraints}
                  />
                  <Form.FieldErrors />
                {/snippet}
              </Form.Control>
            {/snippet}
          </Form.Field>
        </div>

        <Form.Button disabled={$delayed} class="my-2 w-full">
          {#if $delayed}
            <RotateCw size="16" class="mr-2 animate-spin" />
          {/if}
          Login
        </Form.Button>
      </form>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t transition-colors"></span>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background text-muted-foreground px-2 transition-colors"> Or continue with </span>
        </div>
      </div>
      <a
        class={buttonVariants({
          variant: 'outline',
          class: isRedirecting ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
        })}
        onclick={() => (isRedirecting = true)}
        href="/login/google"
        data-sveltekit-reload
      >
        {#if isRedirecting}
          <RotateCw size="16" class="mr-2 animate-spin" />
        {/if}
        Google
      </a>
    </div>

    <div class="mt-4 text-center text-sm">
      Don&apos;t have an account?
      <a href="/register" class="underline"> Sign up </a>
    </div>
  </Card.Content>
</Card.Root>
