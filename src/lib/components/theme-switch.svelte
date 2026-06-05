<script lang="ts">
  import { mode } from 'mode-watcher';
  import { fade, fly } from 'svelte/transition';

  import { Theme } from '$lib/constants';
  import { useTheme } from '$lib/hooks/use-theme';

  import { Button } from '$components/ui/button';
  import * as Kbd from '$components/ui/kbd';
  import * as Tooltip from '$components/ui/tooltip';

  import { Monitor, Moon, Sun } from '@lucide/svelte';

  const theme = useTheme();

  const nextMode = $derived.by(() => {
    if (theme.selectedMode === Theme.SYSTEM) {
      return Theme.LIGHT;
    } else if (theme.selectedMode === Theme.LIGHT) {
      return Theme.DARK;
    } else {
      return Theme.SYSTEM;
    }
  });

  $effect(() => {
    return theme.setupKeyListener();
  });
</script>

{#if mode.current}
  <Tooltip.Provider>
    <Tooltip.Root delayDuration={250} disableCloseOnTriggerClick={true}>
      <Tooltip.Trigger onclick={theme.cycleMode}>
        {#snippet child({ props })}
          <Button
            id="theme-switcher"
            aria-label={`Switch to ${nextMode} mode`}
            variant="outline"
            size="icon"
            class="rounded-full"
            {...props}
          >
            {#if theme.selectedMode === Theme.DARK}
              <span in:fade={{ duration: 300 }}>
                <Monitor size="16" />
              </span>
            {:else if theme.selectedMode === Theme.LIGHT}
              <span in:fly={{ y: -10, duration: 300 }}>
                <Moon size="16" />
              </span>
            {:else if theme.selectedMode === Theme.SYSTEM}
              <span in:fly={{ y: 20, duration: 300 }}>
                <Sun size="16" />
              </span>
            {/if}
          </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content side="left">
        <span class="flex items-center gap-1.5 text-xs">
          <p>switch to {nextMode} mode</p>
          <Kbd.Root>T</Kbd.Root>
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{/if}
