<script lang="ts">
  // Env Variables
  import { PUBLIC_R2_BUCKET_URL } from '$env/static/public';

  // Stores
  import { page } from '$app/state';

  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import * as Avatar from '$lib/components/ui/avatar';
  import { Separator } from '$components/ui/separator';

  // Schemas
  import { createTeamSchema } from '$lib/validations/team';

  // Assets
  import { RotateCw } from '@lucide/svelte';

  let { data } = $props();

  let acceptingInviteState = $state({
    currentlyAccepting: false,
    teamId: 0
  });

  const createTeamForm = superForm(data.createTeamForm, {
    id: 'create-team-form',
    validators: zodClient(createTeamSchema),
    invalidateAll: 'force',
    resetForm: true
  });

  const { form: createTeamFormData, delayed: createTeamFormDelayed, enhance: createTeamFormEnhance } = createTeamForm;
</script>

{#if data.pendingInvites.length > 0}
  <h2 class="font-semi bold pb-4">Pending Invites</h2>
  {#each data.pendingInvites as invite (invite.teamId)}
    <div
      class="border-brand-primary bg-muted mb-2 inline-flex w-full items-center justify-between rounded-lg border p-2 text-sm"
    >
      <p>{invite.team.name}</p>
      <form id="accept-team-invite-form-{invite.teamId}" method="POST" action="/api/invites" class="py-4">
        <Input type="hidden" name="teamId" value={invite.teamId} />
        <Input type="hidden" name="token" value={invite.token} />
        <Form.Button
          type="submit"
          size="sm"
          onclick={() => (acceptingInviteState = { currentlyAccepting: true, teamId: invite.teamId })}
        >
          {#if acceptingInviteState.currentlyAccepting && acceptingInviteState.teamId === invite.teamId}
            <RotateCw size="16" class="animate-spin" />
          {:else}
            Accept
          {/if}
        </Form.Button>
      </form>
    </div>
  {/each}

  <Separator class="my-4" />
{/if}

{#if data.userTeams}
  <div class="grid gap-2">
    <h3 class="mb-0.5 text-base font-medium">Teams</h3>
    {#each data.userTeams as userTeam, index (index)}
      <a href="{page.url.pathname}/{userTeam.team.publicId}">
        <div class="border-primary rounded-xl border-2 p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-semibold md:text-xl">{userTeam.team.name}</h1>
          </div>
          <div class="flex gap-2 py-4">
            {#each userTeam.team.members as member (member.user.publicId)}
              <Avatar.Root class="ring-border z-50 size-7 text-xs ring-2">
                {#if member.user.avatar}
                  <Avatar.Image src={`${PUBLIC_R2_BUCKET_URL}/avatars/${member.user.avatar}`} alt={member.user.email} />
                {/if}
                <Avatar.Fallback class="text-xs uppercase"
                  >{`${member.user.firstName.charAt(0)}${member.user.lastName.charAt(0)}`}</Avatar.Fallback
                >
              </Avatar.Root>
            {/each}
          </div>
        </div>
      </a>
      <Separator class="my-4" />
    {/each}
  </div>
{/if}

<h2 class="text-lg font-semibold">Create a New Team</h2>
<form id="create-team-form" method="POST" action="?/createTeam" class="py-4" use:createTeamFormEnhance>
  <Input type="hidden" name="userId" value={data.user?.id ?? ''} />

  <Form.Field form={createTeamForm} name="name">
    {#snippet children({ constraints })}
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label hidden>Name</Form.Label>
          <Input
            type="text"
            placeholder="My Awesome Team"
            bind:value={$createTeamFormData.name}
            {...props}
            {...constraints}
          />
          <Form.FieldErrors />
        {/snippet}
      </Form.Control>
    {/snippet}
  </Form.Field>

  <Form.Button type="submit" disabled={$createTeamFormDelayed} class="my-2 w-full">
    {#if $createTeamFormDelayed}
      <RotateCw size="16" class="mr-2 animate-spin" />
    {/if}
    Create
  </Form.Button>
</form>
