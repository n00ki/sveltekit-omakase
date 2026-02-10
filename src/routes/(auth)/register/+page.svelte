<script lang="ts">
  import { createUser } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { createUserSchema } from '$lib/validations/auth';

  import { buttonVariants } from '$components/ui/button';
  import * as Card from '$components/ui/card';
  import * as Field from '$components/ui/field';
  import { Input } from '$components/ui/input';

  import { RotateCw } from '@lucide/svelte';

  let isRedirecting = $state(false);
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="font-secondary text-xl">Sign Up</Card.Title>
    <Card.Description>Enter your details below to create your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <form {...createUser.preflight(createUserSchema)} {...useFormValidation(createUser)}>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Field.Field>
              <Field.Label>First name</Field.Label>
              <Input autocomplete="given-name" placeholder="Frank" {...createUser.fields.firstName.as('text')} />
              <Field.Error errors={createUser.fields.firstName.issues()} />
            </Field.Field>
          </div>

          <div>
            <Field.Field>
              <Field.Label>Last name</Field.Label>
              <Input autocomplete="family-name" placeholder="Sinatra" {...createUser.fields.lastName.as('text')} />
              <Field.Error errors={createUser.fields.lastName.issues()} />
            </Field.Field>
          </div>
        </div>

        <div>
          <Field.Field>
            <Field.Label>Email</Field.Label>
            <Input
              autocapitalize="none"
              autocorrect="off"
              autocomplete="username"
              placeholder="email@example.com"
              {...createUser.fields.email.as('email')}
            />
            <Field.Error errors={createUser.fields.email.issues()} />
          </Field.Field>
        </div>

        <div>
          <Field.Field>
            <Field.Label>Password</Field.Label>
            <Input autocomplete="new-password" {...createUser.fields._password.as('password')} />
            <Field.Error errors={createUser.fields._password.issues()} />
          </Field.Field>
        </div>

        <div>
          <Field.Field>
            <Field.Label>Password Confirmation</Field.Label>
            <Input autocomplete="new-password" {...createUser.fields._passwordConfirmation.as('password')} />
            <Field.Error errors={createUser.fields._passwordConfirmation.issues()} />
          </Field.Field>
        </div>

        <button type="submit" disabled={!!createUser.pending} class={buttonVariants({ class: 'my-2 w-full' })}>
          {#if createUser.pending}
            <RotateCw size="16" class="mr-2 animate-spin" />
          {/if}
          Register
        </button>
      </form>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t transition-colors"></span>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground transition-colors"> Or continue with </span>
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
      Already have an account?
      <a href="/login" class="underline"> Sign in </a>
    </div>
  </Card.Content>
</Card.Root>
