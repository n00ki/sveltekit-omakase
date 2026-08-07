<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

  import { cn } from '$lib/utils/utils.js';

  let { ref = $bindable(null), class: className, ...restProps }: AlertDialogPrimitive.OverlayProps = $props();
</script>

<AlertDialogPrimitive.Overlay
  bind:ref
  data-slot="alert-dialog-overlay"
  class={cn(
    'fixed inset-0 z-50 bg-black/10 duration-100 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 supports-backdrop-filter:backdrop-blur-xs',
    className
  )}
  {...restProps}
/>
