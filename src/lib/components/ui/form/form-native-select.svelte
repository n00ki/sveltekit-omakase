<script lang="ts">
  import { Form as FormPrimitive } from 'formsnap';
  import { buttonVariants } from '$components/ui/button';
  import { cn } from '$lib/utils/utils';
  import { CaretSort } from 'svelte-radix';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  type $$Props = HTMLSelectAttributes;

  interface Props {
    class?: string | undefined | null;
    children?: import('svelte').Snippet;
    [key: string]: any;
  }

  let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<div class="relative">
  <FormPrimitive.Select
    class={cn(
      buttonVariants({ variant: 'outline' }),
      'appearance-none bg-transparent font-normal',
      className
    )}
    {...rest}
  >
    {@render children?.()}
  </FormPrimitive.Select>
  <CaretSort class="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
</div>
