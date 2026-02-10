<script lang="ts">
  import type { WithElementRef } from '$lib/utils/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="field-title"
  class={cn(
    'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
