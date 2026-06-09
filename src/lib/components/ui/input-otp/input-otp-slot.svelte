<script lang="ts">
  import { PinInput as InputOTPPrimitive } from 'bits-ui';

  import { cn } from '$lib/utils/utils.js';

  let { ref = $bindable(null), cell, class: className, ...restProps }: InputOTPPrimitive.CellProps = $props();
</script>

<InputOTPPrimitive.Cell
  {cell}
  bind:ref
  data-slot="input-otp-slot"
  class={cn(
    'border-input bg-background aria-invalid:border-destructive relative flex size-9 items-center justify-center border-y border-e text-sm transition-all outline-none first:rounded-s-md first:border-s last:rounded-e-md',
    cell.isActive &&
      'border-ring ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 z-10 ring-[3px]',
    className
  )}
  {...restProps}
>
  {cell.char}
  {#if cell.hasFakeCaret}
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
    </div>
  {/if}
</InputOTPPrimitive.Cell>
