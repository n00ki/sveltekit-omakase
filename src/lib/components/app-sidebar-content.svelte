<script lang="ts">
  import type { Component } from '@lucide/svelte';
  import type { Path } from '$app/types';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import GithubIcon from '#components/github-icon.svelte';
  import * as Sidebar from '#components/ui/sidebar/index.ts';

  export interface SidebarNavigationItem {
    title: string;
    url: Path;
    icon?: typeof Component;
  }

  let {
    items
  }: {
    items: readonly SidebarNavigationItem[];
  } = $props();

  function isActive(href: string): boolean {
    const pathname = new URL(href, page.url.href).pathname;
    return page.url.pathname === pathname || page.url.pathname.startsWith(`${pathname}/`);
  }
</script>

<Sidebar.Group>
  <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
  <Sidebar.Menu>
    {#each items as item (item.title)}
      {@const href = resolve(item.url)}

      <Sidebar.MenuItem>
        <Sidebar.MenuButton data-active={isActive(href) ? '' : undefined} tooltipContent={item.title}>
          {#snippet child({ props })}
            <a {href} {...props}>
              {#if item.icon}
                {@const Icon = item.icon}
                <Icon class="size-4 shrink-0" />
              {/if}
              <span>{item.title}</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    {/each}
  </Sidebar.Menu>
</Sidebar.Group>

<Sidebar.Group class="mt-auto">
  <Sidebar.GroupContent>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="sm" data-active={undefined}>
          {#snippet child({ props })}
            <a href="https://github.com/n00ki/sveltekit-omakase" target="_blank" rel="noopener noreferrer" {...props}>
              <GithubIcon class="shrink-0" />
              <span>GitHub</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.GroupContent>
</Sidebar.Group>
