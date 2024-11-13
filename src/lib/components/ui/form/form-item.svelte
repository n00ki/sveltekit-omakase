<script lang="ts">
  import { cn } from '$lib/utils/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement>;
  interface Props {
    class?: string | undefined | null;
    children?: import('svelte').Snippet;
    [key: string]: any;
  }

  let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<div class={cn('space-y-2', className)} {...rest}>
  {@render children?.()}
</div>
