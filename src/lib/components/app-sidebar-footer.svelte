<script lang="ts">
  import { getAvatarUrl, getAvatarUrl } from '$lib/utils/helpers/image';
  import { getInitials, getInitials } from '$lib/utils/helpers/name';

  import * as Avatar from '$components/ui/avatar';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { useSidebar } from '$components/ui/sidebar';
  import * as Sidebar from '$components/ui/sidebar';

  import { ChevronsUpDown, LogOut, RotateCw, Settings } from '@lucide/svelte';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  const sidebar = useSidebar();

  let logoutForm: HTMLFormElement;
  let isLoggingOut = $state(false);
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            {...props}
          >
            <Avatar.Root class="size-8 rounded-lg">
              {#if user.avatar}
                <Avatar.Image src={getAvatarUrl(user.avatar)} alt={`${user.firstName} ${user.lastName}`} />
              {:else}
                <Avatar.Fallback class="rounded-lg">
                  {getInitials(user.firstName, user.lastName)}
                </Avatar.Fallback>
              {/if}
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{user.name}</span>
              <span class="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-[var(--bits-dropdown-menu-anchor-width)] min-w-56 rounded-lg"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar.Root class="size-8 rounded-lg">
              {#if user.avatar}
                <Avatar.Image src={getAvatarUrl(user.avatar)} alt={`${user.firstName} ${user.lastName}`} />
              {:else}
                <Avatar.Fallback class="rounded-lg">
                  {getInitials(user.firstName, user.lastName)}
                </Avatar.Fallback>
              {/if}
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{`${user.firstName} ${user.lastName}`}</span>
              <span class="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            {#snippet child({ props })}
              <a href="/settings/profile" {...props}>
                <Settings />
                Settings
              </a>
            {/snippet}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onclick={() => {
            isLoggingOut = true;
            logoutForm.submit();
          }}
          disabled={isLoggingOut}
        >
          {#if isLoggingOut}
            <RotateCw size="16" class="mr-2 animate-spin" />
          {:else}
            <LogOut size="16" />
          {/if}
          Log out
          <form bind:this={logoutForm} id="logout" method="POST" action="/logout"></form>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
