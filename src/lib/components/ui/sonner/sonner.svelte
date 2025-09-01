<script lang="ts">
  import type { ToasterProps as SonnerProps } from 'svelte-sonner';

  import { mode } from 'mode-watcher';
  import { Toaster as Sonner } from 'svelte-sonner';

  let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
  theme={mode.current}
  class="toaster group"
  style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
  {...restProps}
/>
