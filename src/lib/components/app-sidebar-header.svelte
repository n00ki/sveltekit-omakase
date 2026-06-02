<script lang="ts">
  import { resolve } from '$app/paths';

  import * as Sidebar from '$components/ui/sidebar';

  import logo from '$lib/assets/logo.png';
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton size="lg" data-active={undefined}>
      {#snippet child({ props })}
        <a href={resolve('/dashboard')} {...props}>
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <img src={logo} alt="SvelteKit Omakase" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">SvelteKit Omakase</span>
          </div>
        </a>
      {/snippet}
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
</Sidebar.Menu>
