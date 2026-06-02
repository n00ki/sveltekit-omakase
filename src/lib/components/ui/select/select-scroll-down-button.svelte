<script lang="ts">
  import type { WithoutChildrenOrChild } from '$lib/utils/utils.js';

  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { Select as SelectPrimitive } from 'bits-ui';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollDownButton
  bind:ref
  data-slot="select-scroll-down-button"
  class={cn(
    "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full",
    className
  )}
  {...restProps}
>
  <ChevronDownIcon />
</SelectPrimitive.ScrollDownButton>
