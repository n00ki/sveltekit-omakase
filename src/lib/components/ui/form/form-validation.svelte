<script lang="ts">
  import { Form as FormPrimitive } from 'formsnap';
  import { cn } from '$lib/utils/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLParagraphElement>;
  interface Props {
    class?: string | undefined | null;
    [key: string]: any;
  }

  let { class: className = undefined, ...rest }: Props = $props();
</script>

<FormPrimitive.Validation
  class={cn('text-[0.8rem] font-medium text-destructive', className)}
  {...rest}
/>
