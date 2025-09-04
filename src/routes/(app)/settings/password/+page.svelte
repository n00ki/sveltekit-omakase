<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  import { editPasswordSchema } from '$lib/validations/auth';

  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';

  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(editPasswordSchema)
  });

  const { hasCredentialAccount } = data;

  const { form: formData, delayed, enhance } = form;
</script>

<div class="flex w-full flex-1 flex-col justify-center gap-4">
  <header>
    <h3 class="mb-0.5 text-base font-medium">Password Settings</h3>
    <p class="text-xs tracking-tight text-muted-foreground">
      {hasCredentialAccount ? 'Update your password' : 'Set a password for your account'}
    </p>
  </header>

  <form id="edit-password-form" method="POST" use:enhance>
    <!-- Hidden field to track if user has credential account -->
    <input type="hidden" name="hasCredentialAccount" value={hasCredentialAccount} />

    {#if hasCredentialAccount}
      <div class="grid gap-2">
        <Form.Field {form} name="currentPassword">
          {#snippet children({ constraints })}
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Current Password</Form.Label>
                <Input
                  type="password"
                  autocomplete="current-password"
                  placeholder="********"
                  bind:value={$formData.currentPassword}
                  {...props}
                  {...constraints}
                />
                <Form.FieldErrors />
              {/snippet}
            </Form.Control>
          {/snippet}
        </Form.Field>
      </div>
    {/if}

    <div class="grid gap-2">
      <Form.Field {form} name="password">
        {#snippet children({ constraints })}
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>New Password</Form.Label>
              <Input
                type="password"
                autocomplete="new-password"
                placeholder="********"
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
              <Form.Label>Confirm Password</Form.Label>
              <Input
                type="password"
                autocomplete="new-password"
                placeholder="********"
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

    <Form.Button disabled={$delayed} variant="secondary" class="my-2 w-full">
      {#if $delayed}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      {hasCredentialAccount ? 'Update Password' : 'Set Password'}
    </Form.Button>
  </form>
</div>
