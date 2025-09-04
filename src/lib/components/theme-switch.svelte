<script lang="ts">
  import { mode, userPrefersMode } from 'mode-watcher';
  import { fade, fly } from 'svelte/transition';

  import { useTheme } from '$lib/hooks/use-theme';

  import { Button } from '$components/ui/button';
  import * as Tooltip from '$components/ui/tooltip';

  import { Monitor, Moon, Sun } from '@lucide/svelte';

  const { cycleMode, setupKeyListener } = useTheme();

  const nextMode = $derived.by(() => {
    const currentMode = userPrefersMode.current || 'system';
    if (currentMode === 'system') {
      return 'light';
    } else if (currentMode === 'light') {
      return 'dark';
    } else {
      return 'system';
    }
  });

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
            aria-label={`Switch to ${nextMode} mode`}
            variant="outline"
            size="icon"
            class="rounded-full"
            {...props}
          >
            {#if userPrefersMode.current === 'dark'}
              <span in:fade={{ duration: 300 }}>
                <Monitor size="16" />
              </span>
            {:else if userPrefersMode.current === 'light'}
              <span in:fly={{ y: -10, duration: 300 }}>
                <Moon size="16" />
              </span>
            {:else if userPrefersMode.current === 'system'}
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
          <p class="rounded-sm bg-muted px-1 py-0.5 font-semibold text-foreground">T</p>
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{/if}
