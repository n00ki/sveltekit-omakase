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
  class={cn('size-5 [&>svg]:size-4 flex items-center justify-center', className)}
  {...restProps}
>
  <MoreHorizontalIcon />
  <span class="sr-only">More</span>
</span>
