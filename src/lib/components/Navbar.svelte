<script lang="ts">
  // Types
  import type { User } from 'lucia';

  // Components
  import { Button } from '$components/ui/button';
  import * as DropdownMenu from '$components/ui/dropdown-menu';

  // Assets
  import { HamburgerMenu } from 'svelte-radix';

  export let user: User | null = null;

  let logoutForm: HTMLFormElement;
</script>

<nav class="z-50">
  <div class="flex items-center justify-between p-4">
    <div>
      <Button href="/" variant="ghost" class="text-xl font-bold normal-case">SvelteKit Omakase</Button>
    </div>

    <div class="hidden items-center gap-2 lg:inline-flex">
      {#if !user}
        <Button href="/register" variant="outline" class="transition-none">Get started now</Button>
      {:else}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder class="rounded-full">
            <Button
              variant="ghost"
              builders={[builder]}
              class="transition-all duration-100 ease-in-out hover:ring-2 hover:ring-secondary/90"
            >
              <HamburgerMenu class="text-muted-foreground" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56">
            <DropdownMenu.Label>{`${user.firstName} ${user.lastName}`}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item href="/settings/profile">User Profile</DropdownMenu.Item>
              <DropdownMenu.Item href="/settings/accounts">Teams</DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item on:click={() => logoutForm.submit()}>Log out</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {/if}
    </div>

    <!-- Mobile -->
    <div class="inline-flex items-center gap-2 lg:hidden">
      {#if !user}
        <Button href="/login" variant="outline" class="transition-none">Get started now</Button>
      {:else}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder class="rounded-full">
            <Button
              variant="ghost"
              builders={[builder]}
              class="transition-all duration-100 ease-in-out hover:ring-2 hover:ring-secondary/90"
            >
              <HamburgerMenu class="text-muted-foreground" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56">
            <DropdownMenu.Label>{`${user.firstName} ${user.lastName}`}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item href="/settings/profile">User Profile</DropdownMenu.Item>
              <DropdownMenu.Item href="/settings/accounts">Teams</DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item on:click={() => logoutForm.submit()}>Log out</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {/if}
    </div>
  </div>

  <form bind:this={logoutForm} id="logout" method="POST" action="/logout" />
</nav>
