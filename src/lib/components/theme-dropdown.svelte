<script lang="ts">
  import { resetMode, setMode, userPrefersMode } from 'mode-watcher';

  import { useTheme } from '$lib/hooks/use-theme';

  import { Button } from '$components/ui/button';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import * as Tooltip from '$components/ui/tooltip';

  import { Monitor, Moon, Sun } from '@lucide/svelte';

  const { setupKeyListener } = useTheme();

  $effect(() => {
    return setupKeyListener();
  });

  function handleModeChange(value: 'light' | 'dark' | 'system') {
    if (value === 'system') {
      resetMode();
    } else {
      setMode(value);
    }
  }
</script>

<div>
  <DropdownMenu.Root>
    <Tooltip.Provider delayDuration={250} ignoreNonKeyboardFocus={true}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <DropdownMenu.Trigger>
              {#snippet child({ props: triggerProps })}
                <Button variant="ghost" size="icon" class="size-9 rounded-lg" {...props} {...triggerProps}>
                  {#if userPrefersMode.current === 'light'}
                    <Sun size="16" />
                  {:else if userPrefersMode.current === 'dark'}
                    <Moon size="16" />
                  {:else}
                    <Monitor size="16" />
                  {/if}
                  <span class="sr-only">Toggle theme</span>
                </Button>
              {/snippet}
            </DropdownMenu.Trigger>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content side="left">
          <span class="flex items-center gap-1.5 text-xs">
            <p>toggle theme</p>
            <p class="rounded-sm bg-muted px-1 py-0.5 font-semibold text-foreground">T</p>
          </span>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item onclick={() => handleModeChange('light')}>
        <span class="flex items-center gap-2">
          <Sun size="16" />
          Light
        </span>
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => handleModeChange('dark')}>
        <span class="flex items-center gap-2">
          <Moon size="16" />
          Dark
        </span>
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => handleModeChange('system')}>
        <span class="flex items-center gap-2">
          <Monitor size="16" />
          System
        </span>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
