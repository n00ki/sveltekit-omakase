<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { type WithElementRef } from 'bits-ui';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    inset,
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> & {
    inset?: boolean;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="menubar-label"
  data-inset={inset}
  class={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
  {...restProps}
>
  {@render children?.()}
</div>
