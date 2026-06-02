<script lang="ts">
  import type { ButtonSize, ButtonVariant } from '$lib/components/ui/button/index.js';

  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    variant = 'default',
    size = 'default',
    ...restProps
  }: AlertDialogPrimitive.ActionProps & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  } = $props();
</script>

<AlertDialogPrimitive.Action
  bind:ref
  data-slot="alert-dialog-action"
  class={cn(buttonVariants({ variant, size }), 'cn-alert-dialog-action', className)}
  {...restProps}
/>
