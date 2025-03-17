<script lang="ts">
  // Stores
  import { page } from '$app/state';

  // Components
  import AppSidebar from '$components/Sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Separator } from '$lib/components/ui/separator';

  let { data, children } = $props();

  let sidebarState = $state({
    open: true,
    ready: false
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

  $effect(() => {
    sidebarState.open = localStorage.getItem('sidebar') !== 'false';
    sidebarState.ready = true;
  });

  const handleSidebarChange = (open: boolean) => {
    sidebarState.open = open;
    localStorage.setItem('sidebar', String(open));
  };
</script>

{#if sidebarState.ready}
  <Sidebar.Provider bind:open={sidebarState.open} onOpenChange={handleSidebarChange}>
    <AppSidebar user={data.user} />

    <Sidebar.Inset>
      <header
        class="border-border/70 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <Sidebar.Trigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb.Root>
            <Breadcrumb.List>
              {#each breadcrumbs as item, i (i)}
                <Breadcrumb.Item>
                  {#if i === breadcrumbs.length - 1}
                    <Breadcrumb.Page>{item.title}</Breadcrumb.Page>
                  {:else}
                    <Breadcrumb.Link href={item.href ?? '#'}>
                      {item.title}
                    </Breadcrumb.Link>
                  {/if}
                </Breadcrumb.Item>
                {#if i !== breadcrumbs.length - 1}
                  <Breadcrumb.Separator />
                {/if}
              {/each}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
      </header>
      {@render children?.()}
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
