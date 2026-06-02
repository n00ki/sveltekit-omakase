<script lang="ts">
  import type { WithElementRef } from '$lib/utils/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {} = $props();
</script>

<div
  bind:this={ref}
  data-slot="select-label"
  class={cn('text-muted-foreground px-1.5 py-1 text-xs', className)}
  {...restProps}
>
  {@render children?.()}
</div>
