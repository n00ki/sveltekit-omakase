<script lang="ts">
  import type { WithElementRef } from '#lib/utils/utils.ts';
  import type { HTMLLiAttributes } from 'svelte/elements';

  import { cn } from '#lib/utils/utils.ts';

  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLLiAttributes> = $props();
</script>

<li bind:this={ref} data-slot="breadcrumb-item" class={cn('inline-flex items-center gap-1', className)} {...restProps}>
  {@render children?.()}
</li>
