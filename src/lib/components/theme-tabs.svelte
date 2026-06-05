<script lang="ts">
  import type { Mode } from '$lib/hooks/use-theme';
  import type { Component } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import { Theme } from '$lib/constants';
  import { useTheme } from '$lib/hooks/use-theme';
  import { cn } from '$lib/utils/utils';

  import * as ToggleGroup from '$components/ui/toggle-group';

  import { Monitor, Moon, Sun } from '@lucide/svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string | undefined | null;
  }

  type ModeOption = {
    value: Mode;
    label: string;
    icon: Component;
  };

  let { class: className = undefined }: Props = $props();

  const theme = useTheme();

  const modes: ModeOption[] = [
    { value: Theme.LIGHT, label: 'Light', icon: Sun },
    { value: Theme.DARK, label: 'Dark', icon: Moon },
    { value: Theme.SYSTEM, label: 'System', icon: Monitor }
  ];

  function handleModeChange(value: string | undefined): void {
    if (!isMode(value)) return;

    theme.setMode(value);
  }

  function isMode(value: string | undefined): value is Mode {
    return value === Theme.LIGHT || value === Theme.DARK || value === Theme.SYSTEM;
  }
</script>

<ToggleGroup.Root
  type="single"
  value={theme.selectedMode}
  spacing={1}
  onValueChange={handleModeChange}
  class={cn('inline-flex max-w-full rounded-lg bg-muted p-1', className)}
  aria-label="Theme"
>
  {#each modes as mode (mode.value)}
    {@const Icon = mode.icon}

    <ToggleGroup.Item
      value={mode.value}
      aria-label={`${mode.label} theme`}
      class={cn(
        'h-8 min-w-0 flex-1 rounded-md px-3 text-muted-foreground transition-colors sm:flex-none sm:px-3.5',
        'hover:bg-accent hover:text-accent-foreground',
        'data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm'
      )}
    >
      <Icon size="16" />
      <span class="ml-1.5 text-sm">{mode.label}</span>
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>
