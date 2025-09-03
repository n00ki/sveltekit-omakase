<script lang="ts">
  import type { ButtonVariant } from '$components/ui/button/index.js';

  import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
  import { Calendar as CalendarPrimitive } from 'bits-ui';

  import { cn } from '$lib/utils/utils.js';

  import { buttonVariants } from '$components/ui/button/index.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    variant = 'ghost',
    ...restProps
  }: CalendarPrimitive.PrevButtonProps & {
    variant?: ButtonVariant;
  } = $props();
</script>

{#snippet Fallback()}
  <ChevronLeftIcon class="size-4" />
{/snippet}

<CalendarPrimitive.PrevButton
  bind:ref
  class={cn(
    buttonVariants({ variant }),
    'size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50 rtl:rotate-180',
    className
  )}
  children={children || Fallback}
  {...restProps}
/>
