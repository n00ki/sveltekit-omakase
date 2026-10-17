<script lang="ts">
  import type { WithElementRef } from '#lib/utils/utils.ts';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '#lib/utils/utils.ts';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props();
</script>

<li
  bind:this={ref}
  data-slot="sidebar-menu-item"
  data-sidebar="menu-item"
  class={cn('group/menu-item relative', className)}
  {...restProps}
>
  {@render children?.()}
</li>
