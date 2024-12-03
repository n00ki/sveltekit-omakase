<script lang="ts">
  // Env Variables
  import { PUBLIC_AWS_S3_BUCKET_URL } from '$env/static/public';

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
  import { Button } from '$components/ui/button';
  import * as AlertDialog from '$components/ui/alert-dialog';
  import * as Breadcrumb from '$components/ui/breadcrumb';
  import { Separator } from '$components/ui/separator';

  // Assets
  import { Reload, Pencil2 } from 'svelte-radix';

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
</script>

<div class="mb-2">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/settings/accounts">Teams</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>{data.account.name}</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
</div>

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
            <Pencil2 size="18" />
          </Button>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<div class="py-2">
  <ul class="flex w-full flex-wrap items-start gap-4 pt-2">
    {#each data.account.members as member}
      <li class="flex flex-col items-center justify-center">
        <Avatar.Root class="size-6 ring-2 ring-border md:size-10">
          {#if member.user.avatar}
            <Avatar.Image src={`${PUBLIC_AWS_S3_BUCKET_URL}/avatars/${member.user.avatar}`} alt={member.user.email} />
          {/if}
          <Avatar.Fallback class="text-xs uppercase md:text-base"
            >{`${member.user.firstName.charAt(0)}${member.user.lastName.charAt(0)}`}</Avatar.Fallback
          >
        </Avatar.Root>
        {#if member.role === 'admin'}
          <p class="mt-1 text-sm font-light">{member.role}</p>
        {/if}
      </li>
    {/each}
  </ul>
</div>

{#if data.account.type !== 'personal'}
  {#if data.account.members.find((m) => m.userId === data.user?.id && m.role === 'admin')}
    <Separator class="my-4" />
    <h2 class="text-lg font-semibold">Invite a new team member</h2>
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
          <Reload class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Invite
      </Form.Button>
    </form>
  {/if}

  <Separator class="my-4" />

  <h2 class="text-lg font-semibold">Danger Zone</h2>
  {#if data.account.members.find((m) => m.userId === data.user?.id && m.role === 'admin')}
    <AlertDialog.Root>
      <AlertDialog.Trigger class="w-full">
        <Button variant="destructive" class="my-2 w-full">Delete Team Account</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            {m.accounts.delete.destructiveOperation}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Back to safety</AlertDialog.Cancel>
          <AlertDialog.Action
            type="submit"
            form="delete-account-form"
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
  {:else}
    <form id="leave-account-form" method="POST" action="?/leaveAccount" use:leaveAccountFormEnhance>
      <Input type="hidden" name="accountId" bind:value={data.account.id} />
      <Input type="hidden" name="userId" value={data.user?.id} />

      <Form.Button type="submit" variant="destructive" disabled={$leaveAccountFormDelayed} class="my-2 w-full">
        {#if $leaveAccountFormDelayed}
          <Reload class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Leave Account
      </Form.Button>
    </form>
  {/if}
{/if}
