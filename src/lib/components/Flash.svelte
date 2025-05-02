<script lang="ts">
  // Utils
  import { fly } from 'svelte/transition';
  import { cn } from '$lib/utils/utils';

  // Assets
  import { CircleCheck, TriangleAlert, CircleX } from '@lucide/svelte';

  interface Props {
    type: 'success' | 'error' | 'warning';
    message: string;
    class?: string;
  }

  let { type, message, class: className = '' }: Props = $props();

  const baseStyles =
    'fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded-lg border p-2 space-y-1 h-fit md:top-4 md:right-4 md:left-auto md:translate-x-0';
  const typeStyles = {
    success:
      'border-green-100 bg-green-50 text-green-700 dark:border-green-200/10 dark:bg-green-700/10 dark:text-green-100 [&>div>svg]:text-green-700 dark:[&>div>svg]:text-green-100',
    error:
      'border-red-100 bg-red-50 text-red-700 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100 [&>div>svg]:text-red-700 dark:[&>div>svg]:text-red-100',
    warning:
      'border-yellow-100 bg-yellow-50 text-yellow-700 dark:border-yellow-200/10 dark:bg-yellow-700/10 dark:text-yellow-100 [&>div>svg]:text-yellow-700 dark:[&>div>svg]:text-yellow-100'
  };
</script>

<div class={cn(baseStyles, typeStyles[type], className)} transition:fly={{ y: -20, duration: 300 }}>
  <div class="flex items-center gap-2">
    <div>
      {#if type === 'success'}
        <CircleCheck size="18" />
      {:else if type === 'error'}
        <CircleX size="18" />
      {:else if type === 'warning'}
        <TriangleAlert size="18" />
      {/if}
    </div>

    <div class="text-sm">
      {message}
    </div>
  </div>
</div>
