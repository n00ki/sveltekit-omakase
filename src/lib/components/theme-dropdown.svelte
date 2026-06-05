<script lang="ts">
  import { Theme } from '$lib/constants';
  import { useTheme } from '$lib/hooks/use-theme';

  import { Button } from '$components/ui/button';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import * as Kbd from '$components/ui/kbd';
  import * as Tooltip from '$components/ui/tooltip';

  import { Monitor, Moon, Sun } from '@lucide/svelte';

  const theme = useTheme();

  $effect(() => {
    return theme.setupKeyListener();
  });
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
                  {#if theme.selectedMode === Theme.LIGHT}
                    <Sun size="16" />
                  {:else if theme.selectedMode === Theme.DARK}
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
            <Kbd.Root>T</Kbd.Root>
          </span>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item onclick={() => theme.setMode(Theme.LIGHT)}>
        <span class="flex items-center gap-2">
          <Sun size="16" />
          Light
        </span>
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => theme.setMode(Theme.DARK)}>
        <span class="flex items-center gap-2">
          <Moon size="16" />
          Dark
        </span>
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => theme.setMode(Theme.SYSTEM)}>
        <span class="flex items-center gap-2">
          <Monitor size="16" />
          System
        </span>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
