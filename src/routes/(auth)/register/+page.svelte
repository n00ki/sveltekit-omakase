<script lang="ts">
  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { registrationSchema } from '$lib/validations/auth';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import * as Card from '$components/ui/card';

  // Assets
  import { Reload } from 'svelte-radix';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(registrationSchema)
  });

  const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="text-xl">Sign Up</Card.Title>
    <Card.Description>Enter your information to create an account</Card.Description>
  </Card.Header>
  <Card.Content>
    <form method="POST" action="?/register" use:enhance>
      <div class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Form.Field {form} name="firstName">
              {#snippet children({ constraints })}
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>First name</Form.Label>
                    <Input
                      type="text"
                      autocomplete="given-name"
                      placeholder="Frank"
                      bind:value={$formData.firstName}
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
            <Form.Field {form} name="lastName">
              {#snippet children({ constraints })}
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Last name</Form.Label>
                    <Input
                      type="text"
                      autocomplete="family-name"
                      placeholder="Sinatra"
                      bind:value={$formData.lastName}
                      {...props}
                      {...constraints}
                    />
                    <Form.FieldErrors />
                  {/snippet}
                </Form.Control>
              {/snippet}
            </Form.Field>
          </div>
        </div>

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
        </div>

        <div class="grid gap-2">
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
        </div>

        <Form.Button disabled={$delayed} class="my-2 w-full">
          {#if $delayed}
            <Reload class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Register
        </Form.Button>
      </div>
    </form>
    <div class="mt-4 text-center text-sm">
      Already have an account?
      <a href="/login" class="underline"> Sign in </a>
    </div>
  </Card.Content>
</Card.Root>
