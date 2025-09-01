<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { cn, cn } from '$lib/utils/utils.js';

  import { Input } from '$components/ui/input/index.js';

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className,
    ...restProps
  }: ComponentProps<typeof Input> = $props();
</script>

<Input
  bind:ref
  bind:value
  data-slot="sidebar-input"
  data-sidebar="input"
  class={cn('h-8 w-full bg-background shadow-none', className)}
  {...restProps}
/>
