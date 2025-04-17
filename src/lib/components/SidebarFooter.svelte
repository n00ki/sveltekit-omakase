<script lang="ts">
  // Env Variables
  import { PUBLIC_AWS_S3_BUCKET_URL } from '$env/static/public';

  // Types
  import type { SessionValidationResult } from '$lib/server/auth';

  // Components
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { useSidebar } from '$lib/components/ui/sidebar';

  // Assets
  import { ChevronsUpDown, Settings, LogOut } from 'lucide-svelte';

  interface Props {
    user: SessionValidationResult['user'];
  }

  let { user }: Props = $props();

  const sidebar = useSidebar();

  let logoutForm: HTMLFormElement;
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
            <Avatar.Root class="h-8 w-8 rounded-lg">
              <Avatar.Image
                src={`${PUBLIC_AWS_S3_BUCKET_URL}/avatars/${user?.avatar}`}
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <Avatar.Fallback class="rounded-lg">
                {`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
              <span class="truncate text-xs">{user?.email}</span>
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
            <Avatar.Root class="h-8 w-8 rounded-lg">
              <Avatar.Image
                src={`${PUBLIC_AWS_S3_BUCKET_URL}/avatars/${user?.avatar}`}
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <Avatar.Fallback class="rounded-lg">
                {`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
              <span class="truncate text-xs">{user?.email}</span>
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
        <DropdownMenu.Item onclick={() => logoutForm.submit()}>
          <LogOut />
          Log out
          <form bind:this={logoutForm} id="logout" method="POST" action="/logout"></form>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
