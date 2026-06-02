<script lang="ts">
  import { page } from '$app/state';

  import { onMount } from 'svelte';

  import AppSidebar from '$components/app-sidebar.svelte';
  import ThemeDropdown from '$components/theme-dropdown.svelte';
  import * as Breadcrumb from '$components/ui/breadcrumb';
  import { Separator } from '$components/ui/separator';
  import * as Sidebar from '$components/ui/sidebar';

  let { data, children } = $props();

  let sidebarState = $state({
    open: true
  });

  let breadcrumbs = $derived(
    page.data.metadata?.breadcrumbs ??
      page.url.pathname
        .split('/')
        .filter(Boolean)
        .map((item) => ({
          title: item.charAt(0).toUpperCase() + item.slice(1),
          href: `/${item}`
        }))
  );

  onMount(() => {
    sidebarState.open = localStorage.getItem('sidebar') !== 'false';
  });

  const handleSidebarChange = (open: boolean) => {
    sidebarState.open = open;
    localStorage.setItem('sidebar', String(open));
  };
</script>

<Sidebar.Provider bind:open={sidebarState.open} onOpenChange={handleSidebarChange}>
  <AppSidebar user={data.user} />

  <Sidebar.Inset>
    <header
      class="flex h-16 shrink-0 items-center gap-2 border-b border-border/70 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex w-full items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <Sidebar.Trigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb.Root>
            <Breadcrumb.List>
              {#each breadcrumbs as item, index (index)}
                <Breadcrumb.Item>
                  {#if index === breadcrumbs.length - 1}
                    <Breadcrumb.Page>{item.title}</Breadcrumb.Page>
                  {:else}
                    <Breadcrumb.Link href={item.href ?? '#'}>
                      {item.title}
                    </Breadcrumb.Link>
                  {/if}
                </Breadcrumb.Item>
                {#if index !== breadcrumbs.length - 1}
                  <Breadcrumb.Separator />
                {/if}
              {/each}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
        <div>
          <ThemeDropdown />
        </div>
      </div>
    </header>
    {@render children?.()}
  </Sidebar.Inset>
</Sidebar.Provider>

<style>
  :global(html),
  :global(body) {
    background-color: var(--color-sidebar);
  }
</style>
