<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils/utils.js';

  let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.CellProps = $props();
</script>

<RangeCalendarPrimitive.Cell
  bind:ref
  class={cn(
    '[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50 relative size-8 p-0 text-center text-sm focus-within:relative focus-within:z-20 data-highlighted:rounded-r-md first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md [&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md',
    className
  )}
  {...restProps}
/>
