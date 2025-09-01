<script lang="ts">
  import type { WithElementRef } from '$lib/utils/utils.js';
  import type { HTMLLiAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils.js';

  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLLiAttributes> = $props();
</script>

<li
  bind:this={ref}
  data-slot="breadcrumb-item"
  class={cn('inline-flex items-center gap-1.5', className)}
  {...restProps}
>
  {@render children?.()}
</li>
