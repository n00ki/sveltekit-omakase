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

<div bind:this={ref} data-slot="sheet-footer" class={cn('mt-auto flex flex-col gap-2 p-4', className)} {...restProps}>
  {@render children?.()}
</div>
