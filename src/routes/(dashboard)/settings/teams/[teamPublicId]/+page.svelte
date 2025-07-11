<script lang="ts">
  // Env Variables
  import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';
  import { createTeamInviteSchema, deleteTeamSchema, editTeamSchema, leaveTeamSchema } from '$lib/validations/team';
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

  const createTeamInviteForm = superForm(data.createTeamInviteForm, {
    validators: zod4Client(createTeamInviteSchema),
    invalidateAll: 'force'
  });

  const {
    form: createTeamInviteFormData,
    enhance: createTeamInviteFormEnhance,
    delayed: createTeamInviteFormDelayed
  } = createTeamInviteForm;

  const editTeamForm = superForm(data.editTeamForm, {
    validators: zod4Client(editTeamSchema),
    invalidateAll: 'force',
    onSubmit: async ({ formData, cancel }) => {
      if (formData.get('name') === data.team?.name) {
        cancel();
        isEditMode = false;
        toast.error(m.teams.edit.noChanges);
      }
    },
    onResult({ result }) {
      if (result.type === 'redirect' && result.status !== 500) {
        isEditMode = false;
      }
    }
  });

  const { form: editTeamFormData, enhance: editTeamFormEnhance } = editTeamForm;

  const leaveTeamForm = superForm(data.leaveTeamForm, {
    validators: zod4Client(leaveTeamSchema),
    syncFlashMessage: false,
    flashMessage: {
      module: flashModule
    }
  });

  const { delayed: leaveTeamFormDelayed, enhance: leaveTeamFormEnhance } = leaveTeamForm;

  const deleteTeamForm = superForm(data.deleteTeamForm, {
    validators: zod4Client(deleteTeamSchema),
    invalidateAll: 'force'
  });

  const { form: deleteTeamFormData, enhance: deleteTeamFormEnhance } = deleteTeamForm;

  const CONFIRMATION_PHRASE = 'DELETE';
  let deleteConfirmationInput = $state('');
  let isDeleteConfirmed = $derived(deleteConfirmationInput === CONFIRMATION_PHRASE);
</script>

<div>
  {#if isEditMode}
    <form id="edit-team-form" method="POST" action="?/editTeam" use:editTeamFormEnhance>
      <Input type="hidden" name="teamId" value={$editTeamFormData.teamId} />
      <Form.Field form={editTeamForm} name="name">
        {#snippet children({ constraints })}
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label hidden>Name</Form.Label>
              <Input
                type="text"
                placeholder="Team Name"
                bind:value={$editTeamFormData.name}
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
        <h1 class="text-xl font-semibold md:text-2xl">{data.team.name}</h1>
      </div>

      {#if data.team.members.find((member) => member.userId === data.user?.id && member.role === 'admin')}
        <Button
          variant="ghost"
          onclick={() => {
            isEditMode = true;
          }}
        >
          <SquarePen size="18" />
        </Button>
      {/if}
    </div>
  {/if}
</div>

<div class="py-2">
  <ul class="flex w-full flex-wrap items-start gap-4 pt-2">
    {#each data.team.members as member (member.user.publicId)}
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

{#if data.team.members.find((member) => member.userId === data.user?.id && member.role === 'admin')}
  <Separator class="my-4" />
  <h3 class="mb-0.5 text-base font-medium">Invite a new team member</h3>
  <form id="invite-form-{data.team.id}" method="POST" action="?/createTeamInvite" use:createTeamInviteFormEnhance>
    <Input type="hidden" name="teamId" value={$createTeamInviteFormData.teamId} />
    <Form.Field form={createTeamInviteForm} name="email">
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
              bind:value={$createTeamInviteFormData.email}
              {...props}
              {...constraints}
            />
            <Form.FieldErrors />
          {/snippet}
        </Form.Control>
      {/snippet}
    </Form.Field>

    <Form.Button type="submit" disabled={$createTeamInviteFormDelayed} class="my-2 w-full">
      {#if $createTeamInviteFormDelayed}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      Invite
    </Form.Button>
  </form>
{/if}

<Separator class="my-4" />

<h3 class="mb-0.5 text-base font-medium">Danger Zone</h3>

{#if data.team.members.find((member) => member.userId === data.user?.id && member.role === 'admin')}
  <div class="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
    <div class="relative space-y-0.5 text-red-600 dark:text-red-100">
      <p class="font-medium">Warning</p>
      <p class="text-sm">Please proceed with caution, this cannot be undone.</p>
    </div>
    <AlertDialog.Root>
      <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>Delete team</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            {m.teams.delete.destructiveOperation}
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
            form="delete-team-form"
            disabled={!isDeleteConfirmed}
            class="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
          >
            Continue
            <form id="delete-team-form" method="POST" action="?/deleteTeam" use:deleteTeamFormEnhance>
              <Input type="hidden" name="teamId" bind:value={$deleteTeamFormData.teamId} />
            </form>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
{:else}
  <form id="leave-team-form" method="POST" action="?/leaveTeam" use:leaveTeamFormEnhance>
    <Input type="hidden" name="teamId" bind:value={data.team.id} />
    <Input type="hidden" name="userId" value={data.user?.id ?? undefined} />

    <Form.Button type="submit" variant="destructive" disabled={$leaveTeamFormDelayed} class="my-2 w-full">
      {#if $leaveTeamFormDelayed}
        <RotateCw size="16" class="mr-2 animate-spin" />
      {/if}
      Leave Team
    </Form.Button>
  </form>
{/if}
