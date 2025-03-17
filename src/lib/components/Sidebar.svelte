<script lang="ts">
  // Types
  import type { ComponentProps } from 'svelte';
  import type { SessionValidationResult } from '$lib/server/auth';

  // Components
  import SidebarContent from '$components/SidebarContent.svelte';
  import SidebarFooter from '$components/SidebarFooter.svelte';
  import SidebarHeader from '$components/SidebarHeader.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';

  // Assets
  import { LayoutGrid } from 'lucide-svelte';

  interface Props {
    user: SessionValidationResult['user'];
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
