<script lang="ts">
  // Env Variables
  import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { createAccountInviteSchema, deleteAccountSchema, editAccountSchema } from '$lib/validations/account';
  import * as flashModule from 'sveltekit-flash-message/client';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/utils/messages.json';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import * as Avatar from '$lib/components/ui/avatar';
  import { Button, buttonVariants } from '$components/ui/button';
  import * as AlertDialog from '$components/ui/alert-dialog';
  import { Separator } from '$components/ui/separator';

  // Assets
  import { SquarePen, RotateCw } from '@lucide/svelte';

  let { data = $bindable() } = $props();
  let isEditMode = $state(false);

  const createAccountInviteForm = superForm(data.createAccountInviteForm, {
    validators: zodClient(createAccountInviteSchema),
    invalidateAll: 'force'
  });

  const {
    form: createAccountInviteFormData,
    enhance: createAccountInviteFormEnhance,
    delayed: createAccountInviteFormDelayed
  } = createAccountInviteForm;

  const editAccountForm = superForm(data.editAccountForm, {
    validators: zodClient(editAccountSchema),
    invalidateAll: 'force',
    onSubmit: async ({ formData, cancel }) => {
      if (formData.get('name') === data.account.name) {
        cancel();
        isEditMode = false;
        toast.error('No changes were made');
      }
    },
    onResult({ result }) {
      if (result.type === 'redirect' && result.status !== 500) {
        isEditMode = false;
      }
    }
  });

  const { form: editAccountFormData, enhance: editAccountFormEnhance } = editAccountForm;

  const leaveAccountForm = superForm(data.leaveAccountForm, {
    syncFlashMessage: false,
    flashMessage: {
      module: flashModule
    }
  });

  const { delayed: leaveAccountFormDelayed, enhance: leaveAccountFormEnhance } = leaveAccountForm;

  const deleteAccountForm = superForm(data.deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
    invalidateAll: 'force'
  });

  const { form: deleteAccountFormData, enhance: deleteAccountFormEnhance } = deleteAccountForm;

  const CONFIRMATION_PHRASE = 'DELETE';
  let deleteConfirmationInput = $state('');
  let isDeleteConfirmed = $derived(deleteConfirmationInput === CONFIRMATION_PHRASE);
</script>

<div>
  {#if isEditMode}
    <form id="edit-account-form" method="POST" action="?/editAccount" use:editAccountFormEnhance>
      <Input type="hidden" name="accountId" value={$editAccountFormData.accountId} />
      <Form.Field form={editAccountForm} name="name">
        {#snippet children({ constraints })}
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label hidden>Name</Form.Label>
              <Input
                type="text"
                placeholder="Account Name"
                bind:value={$editAccountFormData.name}
                {...props}
                {...constraints}
              />
              <Form.FieldErrors />
            {/snippet}
          </Form.Control>
        {/snippet}
      </Form.Field>

      <Form.Button type="submit" class="my-2 w-full">Update</Form.Button>
    </form>
  {:else}
    <div class="flex w-full items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold md:text-2xl">{data.account.name}</h1>
      </div>

      {#if data.account.type !== 'personal'}
        {#if data.account.members.find((m) => m.userId === data.user?.id && m.role === 'admin')}
          <Button
            variant="ghost"
            onclick={() => {
              isEditMode = true;
            }}
          >
            <SquarePen size="18" />
          </Button>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<div class="py-2">
  <ul class="flex w-full flex-wrap items-start gap-4 pt-2">
    {#each data.account.members as member (member.user.publicId)}
      <li class="flex flex-col items-center justify-center">
        <Avatar.Root class={['ring-border size-7 text-xs ring-2', member.role === 'admin' && 'ring-ring']}>
          {#if member.user.avatar}
            <Avatar.Image src={`${PUBLIC_R2_BUCKET_URL}/avatars/${member.user.avatar}`} alt={member.user.email} />
          {/if}
          <Avatar.Fallback class="text-xs uppercase"
            >{`${member.user.firstName.charAt(0)}${member.user.lastName.charAt(0)}`}</Avatar.Fallback
          >
        </Avatar.Root>
        {#if member.role === 'admin'}
          <p class="mt-1 text-xs font-light">{member.role}</p>
        {/if}
      </li>
    {/each}
  </ul>
</div>

{#if data.account.type !== 'personal'}
  {#if data.account.members.find((m) => m.userId === data.user?.id && m.role === 'admin')}
    <Separator class="my-4" />
    <h3 class="mb-0.5 text-base font-medium">Invite a new team member</h3>
    <form
      id="invite-form-{data.account.id}"
      method="POST"
      action="?/createAccountInvite"
      use:createAccountInviteFormEnhance
    >
      <Input type="hidden" name="accountId" value={$createAccountInviteFormData.accountId} />
      <Form.Field form={createAccountInviteForm} name="email">
        {#snippet children({ constraints })}
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label hidden>Email</Form.Label>
              <Input
                type="email"
                autocapitalize="none"
                autocorrect="off"
                autocomplete="username"
                placeholder="john@doe.com"
                bind:value={$createAccountInviteFormData.email}
                {...props}
                {...constraints}
              />
              <Form.FieldErrors />
            {/snippet}
          </Form.Control>
        {/snippet}
      </Form.Field>

      <Form.Button type="submit" disabled={$createAccountInviteFormDelayed} class="my-2 w-full">
        {#if $createAccountInviteFormDelayed}
          <RotateCw size="16" class="mr-2 animate-spin" />
        {/if}
        Invite
      </Form.Button>
    </form>
  {/if}

  <Separator class="my-4" />

  <h3 class="mb-0.5 text-base font-medium">Danger Zone</h3>

  {#if data.account.members.find((m) => m.userId === data.user?.id && m.role === 'admin')}
    <div class="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
      <div class="relative space-y-0.5 text-red-600 dark:text-red-100">
        <p class="font-medium">Warning</p>
        <p class="text-sm">Please proceed with caution, this cannot be undone.</p>
      </div>
      <AlertDialog.Root>
        <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>Delete account</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              {m.accounts.delete.destructiveOperation}
            </AlertDialog.Description>
          </AlertDialog.Header>
          <Input
            type="text"
            bind:value={deleteConfirmationInput}
            placeholder={`Type "${CONFIRMATION_PHRASE}" to confirm`}
          />
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Back to safety</AlertDialog.Cancel>
            <AlertDialog.Action
              type="submit"
              form="delete-account-form"
              disabled={!isDeleteConfirmed}
              class="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
            >
              Continue
              <form id="delete-account-form" method="POST" action="?/deleteAccount" use:deleteAccountFormEnhance>
                <Input type="hidden" name="accountId" bind:value={$deleteAccountFormData.accountId} />
              </form>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  {:else}
    <form id="leave-account-form" method="POST" action="?/leaveAccount" use:leaveAccountFormEnhance>
      <Input type="hidden" name="accountId" bind:value={data.account.id} />
      <Input type="hidden" name="userId" value={data.user?.id} />

      <Form.Button type="submit" variant="destructive" disabled={$leaveAccountFormDelayed} class="my-2 w-full">
        {#if $leaveAccountFormDelayed}
          <RotateCw size="16" class="mr-2 animate-spin" />
        {/if}
        Leave Account
      </Form.Button>
    </form>
  {/if}
{/if}
