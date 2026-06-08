<script lang="ts">
  import { mode } from 'mode-watcher';
  import { fade, fly } from 'svelte/transition';

  import { useTheme } from '$lib/hooks/use-theme';

  import { Button } from '$components/ui/button';
  import * as Kbd from '$components/ui/kbd';
  import * as Tooltip from '$components/ui/tooltip';

  import { Monitor, Moon, Sun } from '@lucide/svelte';

  import { config } from '$config';

  const theme = useTheme();
  const themeModes = config.theme.modes;

  const nextMode = $derived.by(() => {
    if (theme.selectedMode === themeModes.SYSTEM) {
      return themeModes.LIGHT;
    } else if (theme.selectedMode === themeModes.LIGHT) {
      return themeModes.DARK;
    } else {
      return themeModes.SYSTEM;
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
            {#if theme.selectedMode === themeModes.DARK}
              <span in:fade={{ duration: 300 }}>
                <Monitor size="16" />
              </span>
            {:else if theme.selectedMode === themeModes.LIGHT}
              <span in:fly={{ y: -10, duration: 300 }}>
                <Moon size="16" />
              </span>
            {:else if theme.selectedMode === themeModes.SYSTEM}
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
