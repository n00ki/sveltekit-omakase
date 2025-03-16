<script lang="ts">
  // Types
  import type { SessionValidationResult } from '$lib/server/auth';

  // Components
  import { Button } from '$components/ui/button';
  import * as DropdownMenu from '$components/ui/dropdown-menu';

  // Assets
  import { HamburgerMenu, GithubLogo } from 'svelte-radix';

  interface Props {
    user?: SessionValidationResult['user'] | null;
  }

  let { user = null }: Props = $props();

  let logoutForm: HTMLFormElement;
</script>

<nav class="z-50">
  <div class="flex items-center justify-between p-4">
    <div>
      <Button href="/" variant="ghost" class="px-0 text-xl font-bold normal-case md:px-4"
        >SvelteKit Omakase</Button
      >
    </div>

    <div class="hidden items-center gap-2 lg:inline-flex">
      {#if !user}
        <Button href="/register" variant="outline">Register</Button>
        <Button href="https://github.com/n00ki/sveltekit-omakase" target="_blank" variant="outline">
          <GithubLogo size="16" />
        </Button>
      {:else}
        <Button href="https://github.com/n00ki/sveltekit-omakase" target="_blank" variant="ghost">
          <GithubLogo size="16" />
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger class="rounded-full">
            {#snippet children()}
              <span
                class="hover:bg-accent hover:text-accent-foreground hover:ring-secondary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap hover:ring-2 focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <HamburgerMenu class="text-muted-foreground" />
              </span>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56">
            <DropdownMenu.Label>{`${user.firstName} ${user.lastName}`}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                {#snippet child({ props })}
                  <a href="/settings/profile" {...props}> User Profile </a>
                {/snippet}
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                {#snippet child({ props })}
                  <a href="/settings/accounts" {...props}> Teams </a>
                {/snippet}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={() => logoutForm.submit()}>Log out</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {/if}
    </div>

    <!-- Mobile -->
    <div class="inline-flex items-center gap-2 lg:hidden">
      <Button href="https://github.com/n00ki/sveltekit-omakase" target="_blank" variant="ghost">
        <GithubLogo size="16" />
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="rounded-full">
          {#snippet children()}
            <span
              class="hover:bg-accent hover:text-accent-foreground hover:ring-secondary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap hover:ring-2 focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              <HamburgerMenu class="text-muted-foreground" />
            </span>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
          {#if !user}
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                {#snippet child({ props })}
                  <a href="/login" {...props}>Log in</a>
                {/snippet}
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                {#snippet child({ props })}
                  <a href="/register" {...props}>Register</a>
                {/snippet}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          {:else}
            <DropdownMenu.Label>{`${user.firstName} ${user.lastName}`}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                {#snippet child({ props })}
                  <a href="/settings/profile" {...props}> User Profile </a>
                {/snippet}
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                {#snippet child({ props })}
                  <a href="/settings/accounts" {...props}> Teams </a>
                {/snippet}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={() => logoutForm.submit()}>Log out</DropdownMenu.Item>
          {/if}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>

  <form bind:this={logoutForm} id="logout" method="POST" action="/logout"></form>
</nav>
