<script lang="ts">
  // Types
  import type { ComponentProps } from 'svelte';

  // Assets
  import { LayoutGrid } from '@lucide/svelte';

  import SidebarContent from '$components/app-sidebar-content.svelte';
  import SidebarFooter from '$components/app-sidebar-footer.svelte';
  import SidebarHeader from '$components/app-sidebar-header.svelte';
  // Components
  import * as Sidebar from '$components/ui/sidebar';

  interface Props {
    user: User;
  }

  const navItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutGrid
    }
  ];

  let {
    ref = $bindable(null),
    collapsible = 'icon',
    user,
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & Props = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps} variant="inset">
  <Sidebar.Header>
    <SidebarHeader />
  </Sidebar.Header>
  <Sidebar.Content>
    <SidebarContent items={navItems} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <SidebarFooter {user} />
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
