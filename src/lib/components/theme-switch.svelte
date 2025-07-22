<script lang="ts">
  // Utils
  import { fade, fly } from 'svelte/transition';
  import { mode, userPrefersMode } from 'mode-watcher';
  import { useTheme } from '$lib/hooks/use-theme';

  // Components
  import * as Tooltip from '$components/ui/tooltip';
  import { Button } from '$components/ui/button';

  // Assets
  import { Sun, Moon, Monitor } from '@lucide/svelte';

  const { cycleMode, setupKeyListener } = useTheme();

  $effect(() => {
    return setupKeyListener();
  });
</script>

{#if mode.current}
  <Tooltip.Provider>
    <Tooltip.Root delayDuration={250} disableCloseOnTriggerClick={true}>
      <Tooltip.Trigger onclick={cycleMode}>
        {#snippet child({ props })}
          <Button
            id="theme-switcher"
            aria-label="Cycle through system, light, and dark themes"
            variant="outline"
            size="icon"
            class="rounded-full"
            {...props}
          >
            {#if userPrefersMode.current === 'dark'}
              <span in:fly={{ y: 20, duration: 300 }}>
                <Sun size="16" />
              </span>
            {:else if userPrefersMode.current === 'light'}
              <span in:fly={{ y: -10, duration: 300 }}>
                <Moon size="16" />
              </span>
            {:else}
              <span in:fade={{ duration: 300 }}>
                <Monitor size="16" />
              </span>
            {/if}
          </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content side="left">
        <span class="flex items-center gap-1.5 text-xs">
          <p>switch theme</p>
          <p class="bg-muted text-foreground rounded-sm px-1 py-0.5 font-semibold">T</p>
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{/if}
