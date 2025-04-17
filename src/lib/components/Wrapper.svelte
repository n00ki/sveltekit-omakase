<script lang="ts">
  import { cn } from '$lib/utils/utils';

  interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    children?: import('svelte').Snippet;
  }

  let { size = 'xl', children }: Props = $props();

  const className = 'mx-auto';
  const maxWidth = $derived(`max-w-${size}`);
</script>

<div class="w-full px-2 md:px-0">
  <div class={cn(className, maxWidth)}>
    {@render children?.()}
  </div>
</div>
