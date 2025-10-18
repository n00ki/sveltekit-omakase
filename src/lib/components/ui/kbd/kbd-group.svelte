<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils.js';

  let { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props();
</script>

<kbd data-slot="kbd-group" class={cn('inline-flex items-center gap-1', className)} {...restProps}>
  {@render children?.()}
</kbd>
