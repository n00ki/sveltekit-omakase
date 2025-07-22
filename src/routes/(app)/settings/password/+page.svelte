<script lang="ts">
  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  // Components
  import { Input } from '$components/ui/input';
  import * as Form from '$components/ui/form';

  // Schemas
  import { editPasswordSchema } from '$lib/validations/auth';

  // Assets
  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(editPasswordSchema)
  });

  const { form: formData, delayed, enhance } = form;
</script>

<div class="flex w-full flex-1 flex-col justify-center">
  <form id="edit-password-form" method="POST" use:enhance>
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
      Update Password
    </Form.Button>
  </form>
</div>
