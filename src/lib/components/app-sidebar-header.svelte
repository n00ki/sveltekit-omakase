<script lang="ts">
  import * as Sidebar from '$components/ui/sidebar';

  import logo from '$lib/assets/logo.png';
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton size="lg">
      {#snippet child({ props })}
        <a href="/dashboard" {...props}>
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <img src={logo} alt="kumbaya.dev" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">kumbaya.dev</span>
          </div>
        </a>
      {/snippet}
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
</Sidebar.Menu>
