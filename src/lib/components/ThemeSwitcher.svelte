<script lang="ts">
  // Utils
  import { toggleMode, mode } from 'mode-watcher';
  import { fly } from 'svelte/transition';

  // Components
  import { Button } from '$components/ui/button';

  // Icons
  import { Sun, Moon } from 'svelte-radix';
</script>

{#if $mode}
  <Button
    id="theme-switcher"
    aria-label="Switch themes"
    variant="outline"
    size="icon"
    class="rounded-r-none border-r-0"
    onclick={toggleMode}
  >
    {#if $mode === 'dark'}
      <span in:fly={{ y: 20, duration: 300 }}>
        <Sun size="16" />
      </span>
    {:else}
      <span in:fly={{ y: -10, duration: 300 }}>
        <Moon size="16" />
      </span>
    {/if}
  </Button>
{/if}
