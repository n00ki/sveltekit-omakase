<script lang="ts">
  import type { WithElementRef } from '$lib/utils/utils.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    errors,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    children?: Snippet;
    errors?: { message?: string }[];
  } = $props();

  const messages = $derived((errors ?? []).map((error) => error?.message).filter((m): m is string => !!m));
  const hasContent = $derived(!!children || messages.length > 0);
</script>

{#if hasContent}
  <div
    bind:this={ref}
    role="alert"
    data-slot="field-error"
    class={cn('flex flex-col gap-1 text-xs leading-snug tracking-tight text-destructive/90', className)}
    {...restProps}
  >
    {#if children}
      {@render children()}
    {:else}
      {#each messages as message, index (index)}
        <div class="flex items-start gap-1.5">
          <AlertCircleIcon class="mt-px size-3 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      {/each}
    {/if}
  </div>
{/if}
