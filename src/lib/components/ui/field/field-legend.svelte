<script lang="ts">
  import type { WithElementRef } from '$lib/utils/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    variant = 'legend',
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
    variant?: 'legend' | 'label';
  } = $props();
</script>

<legend
  bind:this={ref}
  data-slot="field-legend"
  data-variant={variant}
  class={cn('mb-3 font-medium', 'data-[variant=legend]:text-base', 'data-[variant=label]:text-sm', className)}
  {...restProps}
>
  {@render children?.()}
</legend>
