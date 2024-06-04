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
      <Button href="/" variant="ghost" class="px-0 text-xl font-bold normal-case md:px-4">SvelteKit Omakase</Button>
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
          {#if !user}
            <DropdownMenu.Group>
              <DropdownMenu.Item href="/login">Login</DropdownMenu.Item>
              <DropdownMenu.Item href="/register">Register</DropdownMenu.Item>
            </DropdownMenu.Group>
          {:else}
            <DropdownMenu.Label>{`${user.firstName} ${user.lastName}`}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item href="/settings/profile">User Profile</DropdownMenu.Item>
              <DropdownMenu.Item href="/settings/accounts">Teams</DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item on:click={() => logoutForm.submit()}>Log out</DropdownMenu.Item>
          {/if}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>

  <form bind:this={logoutForm} id="logout" method="POST" action="/logout" />
</nav>
