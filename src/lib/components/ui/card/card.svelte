<script lang="ts">
  import type { WithElementRef } from '#lib/utils/utils.ts';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '#lib/utils/utils.ts';

  let {
    ref = $bindable(null),
    class: className,
    children,
    size = 'default',
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & { size?: 'default' | 'sm' } = $props();
</script>

<div
  bind:this={ref}
  data-slot="card"
  data-size={size}
  class={cn(
    'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
