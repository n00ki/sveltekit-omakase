<script lang="ts">
  import type { WithElementRef } from '$lib/utils/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<kbd bind:this={ref} data-slot="kbd-group" class={cn('gap-1 inline-flex items-center', className)} {...restProps}>
  {@render children?.()}
</kbd>
