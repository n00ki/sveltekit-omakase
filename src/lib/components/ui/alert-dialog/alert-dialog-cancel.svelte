<script lang="ts">
  import type { ButtonSize, ButtonVariant } from '$lib/components/ui/button/index.js';

  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    variant = 'outline',
    size = 'default',
    ...restProps
  }: AlertDialogPrimitive.CancelProps & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  } = $props();
</script>

<AlertDialogPrimitive.Cancel
  bind:ref
  data-slot="alert-dialog-cancel"
  class={cn(buttonVariants({ variant, size }), 'cn-alert-dialog-cancel', className)}
  {...restProps}
/>
