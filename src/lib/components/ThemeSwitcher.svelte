<script lang="ts">
  // Utils
  import { toggleMode, mode } from 'mode-watcher';
  import { fly } from 'svelte/transition';

  // Components
  import * as Tooltip from '$components/ui/tooltip';
  import { Button } from '$components/ui/button';

  // Assets
  import { Sun, Moon } from 'lucide-svelte';

  $effect(() => {
    const keyListener = (e: KeyboardEvent) => {
      // Ignore key presses when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'd') {
        toggleMode();
      }
    };

    window.addEventListener('keydown', keyListener);

    return () => {
      window.removeEventListener('keydown', keyListener);
    };
  });
</script>

{#if $mode}
  <Tooltip.Provider>
    <Tooltip.Root delayDuration={250}>
      <Tooltip.Trigger onclick={toggleMode}>
        {#snippet child({ props })}
          <Button
            id="theme-switcher"
            aria-label="Switch themes"
            variant="outline"
            size="icon"
            class="rounded-full"
            {...props}
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
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content side="left">
        <span class="flex items-center gap-1.5 text-xs">
          <p>toggle theme</p>
          <p class="bg-muted text-foreground rounded-sm px-1 py-0.5 font-semibold">D</p>
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{/if}
