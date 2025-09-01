<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { cn } from '$lib/utils/utils.js';

  import { Separator } from '$components/ui/separator/index.js';

  import { cn } from '$lib/utils/utils.js';

  let { ref = $bindable(null), class: className, ...restProps }: ComponentProps<typeof Separator> = $props();
</script>

<Separator
  bind:ref
  data-slot="sidebar-separator"
  data-sidebar="separator"
  class={cn('bg-sidebar-border', className)}
  {...restProps}
/>
