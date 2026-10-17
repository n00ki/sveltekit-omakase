<script lang="ts">
  import type { WithElementRef } from '#lib/utils/utils.ts';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '#lib/utils/utils.ts';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="popover-title" class={cn('font-medium', className)} {...restProps}>
  {@render children?.()}
</div>
