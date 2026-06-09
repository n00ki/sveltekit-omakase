<script lang="ts">
  import type { WithElementRef } from '$lib/utils/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  import MinusIcon from '@lucide/svelte/icons/minus';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();
</script>

<div
  bind:this={ref}
  data-slot="input-otp-separator"
  role="separator"
  class={cn("flex items-center [&_svg:not([class*='size-'])]:size-4", className)}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    <MinusIcon />
  {/if}
</div>
