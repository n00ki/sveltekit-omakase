<script lang="ts">
  import type { WithElementRef, WithoutChildren } from '$lib/utils/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props();
</script>

<span
  bind:this={ref}
  data-slot="breadcrumb-ellipsis"
  role="presentation"
  aria-hidden="true"
  class={cn('flex size-5 items-center justify-center [&>svg]:size-4', className)}
  {...restProps}
>
  <MoreHorizontalIcon />
  <span class="sr-only">More</span>
</span>
