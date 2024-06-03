<script lang="ts">
  import { cn } from '$lib/utils/utils';

  export let size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' = 'xl';

  const className = 'mx-auto';
  const maxWidth = 'max-w-' + size;
</script>

<div class="w-full">
  <div class={cn(className, maxWidth)}>
    <slot />
  </div>
</div>
