<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

  import { cn } from '$lib/utils/utils.js';

  import { buttonVariants } from '$components/ui/button/index.js';

  let { ref = $bindable(null), class: className, ...restProps }: AlertDialogPrimitive.ActionProps = $props();
</script>

<AlertDialogPrimitive.Action
  bind:ref
  data-slot="alert-dialog-action"
  class={cn(buttonVariants(), className)}
  {...restProps}
/>
