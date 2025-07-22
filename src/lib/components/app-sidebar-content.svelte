<script lang="ts">
  // Types
  import { type Component } from '@lucide/svelte';

  // Stores
  import { page } from '$app/state';

  // Components
  import * as Sidebar from '$lib/components/ui/sidebar';

  // Assets
  import { Github } from '@lucide/svelte';

  let {
    items
  }: {
    items: {
      title: string;
      url: string;
      icon?: typeof Component;
    }[];
  } = $props();
</script>

<Sidebar.Group>
  <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
  <Sidebar.Menu>
    {#each items as item (item.title)}
      {@const isActive = page.url.pathname === item.url}

      <Sidebar.MenuButton {isActive}>
        {#snippet child({ props })}
          <a href={item.url} {...props}>
            {#if item.icon}
              {@const Icon = item.icon}
              <Icon class="size-4 shrink-0" />
            {/if}
            <span>{item.title}</span>
          </a>
        {/snippet}
      </Sidebar.MenuButton>
    {/each}
  </Sidebar.Menu>
</Sidebar.Group>

<Sidebar.Group class="mt-auto">
  <Sidebar.GroupContent>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="sm">
          {#snippet child({ props })}
            <a href="https://github.com/n00ki/sveltekit-omakase" target="_blank" rel="noopener noreferrer" {...props}>
              <Github class="size-4 shrink-0" />
              <span>GitHub</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.GroupContent>
</Sidebar.Group>
