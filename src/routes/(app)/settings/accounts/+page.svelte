<script lang="ts">
  // Env Variables
  import { PUBLIC_AWS_S3_BUCKET_URL, PUBLIC_BASE_URL } from '$env/static/public';

  // Stores
  import { page } from '$app/stores';

  // Utils
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  // Components
  import * as Form from '$components/ui/form';
  import { Input } from '$components/ui/input';
  import { Badge } from '$components/ui/badge';
  import * as Avatar from '$lib/components/ui/avatar';
  import { Separator } from '$components/ui/separator';

  // Schemas
  import { createAccountSchema } from '$lib/validations/account';

  // Assets
  import { Reload } from 'svelte-radix';
  import { goto, invalidateAll } from '$app/navigation';

  export let data;

  const form = superForm(data.form, {
    validators: zodClient(createAccountSchema),
    invalidateAll: 'force',
    resetForm: true
  });

  const { form: formData, delayed, enhance } = form;

  function handleAcceptInvite(accountId: number, token: string) {
    invalidateAll();
    goto(`${PUBLIC_BASE_URL}/invites?account=${accountId}&token=${token}`);
  }
</script>

{#if data.pendingInvites.length > 0}
  <h2 class="pb-4 font-semibold">Pending Invites</h2>
  {#each data.pendingInvites as invite}
    <div
      class="mb-2 inline-flex w-full items-center justify-between rounded-lg border border-brand-primary bg-muted p-2 text-sm"
    >
      <p>{invite.account.name}</p>
      <Form.Button size="sm" on:click={() => handleAcceptInvite(invite.accountId, invite.token)}>Accept</Form.Button>
    </div>
  {/each}

  <Separator class="my-4" />
{/if}

{#if data.userAccounts}
  <div class="grid gap-2">
    {#each data.userAccounts as userAccount}
      {#if userAccount.account.type !== 'personal'}
        <a href="{$page.url.pathname}/{userAccount.account.publicId}">
          <div class="rounded-xl border-2 border-primary p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <h1 class="text-lg font-semibold md:text-xl">{userAccount.account.name}</h1>
              <Badge variant="outline">{userAccount.account.type}</Badge>
            </div>
            <div class="flex gap-2 py-4">
              {#each userAccount.account.members as member}
                <Avatar.Root class="z-50 size-6 ring-2 ring-border md:size-10">
                  {#if member.user.avatar}
                    <Avatar.Image
                      src={`${PUBLIC_AWS_S3_BUCKET_URL}/avatars/${member.user.avatar}`}
                      alt={member.user.email}
                    />
                  {/if}
                  <Avatar.Fallback class="text-xs uppercase md:text-base"
                    >{`${member.user.firstName.charAt(0)}${member.user.lastName.charAt(0)}`}</Avatar.Fallback
                  >
                </Avatar.Root>
              {/each}
            </div>
          </div>
        </a>
        <Separator class="my-4" />
      {/if}
    {/each}
  </div>
{/if}

<h2 class="text-lg font-semibold">Create a New Team Account</h2>
<form id="create-account-form" method="POST" action="?/createAccount" class="py-4" use:enhance>
  <Input type="hidden" name="userId" value={data.user?.id ?? ''} />

  <Form.Field {form} name="name" let:constraints>
    <Form.Control let:attrs>
      <Form.Label hidden>Name</Form.Label>
      <Input type="text" placeholder="Account Name" bind:value={$formData.name} {...attrs} {...constraints} />
      <Form.FieldErrors />
    </Form.Control>
  </Form.Field>

  <Form.Button type="submit" disabled={$delayed} class="my-2 w-full">
    {#if $delayed}
      <Reload class="mr-2 h-4 w-4 animate-spin" />
    {/if}
    Create
  </Form.Button>
</form>
