<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { Menubar as MenubarPrimitive } from 'bits-ui';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    inset,
    class: className,
    ...restProps
  }: ComponentProps<typeof MenubarPrimitive.GroupHeading> & {
    inset?: boolean;
  } = $props();
</script>

<MenubarPrimitive.GroupHeading
  bind:ref
  data-slot="menubar-group-heading"
  data-inset={inset}
  class={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
  {...restProps}
/>
