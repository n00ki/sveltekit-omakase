<script lang="ts">
  // Utils
  import { fly } from 'svelte/transition';

  // Assets
  import { CheckCircled, ExclamationTriangle, CrossCircled } from 'svelte-radix';

  interface Props {
    type: 'success' | 'error' | 'warning';
    message: string;
  }

  let { type, message }: Props = $props();

  const title = type === 'success' ? 'Success!' : type === 'error' ? 'Oops...' : 'Warning!';
  const bgColor = type === 'error' ? 'destructive' : 'primary';
  const textColor = type === 'error' ? 'destructive-foreground' : 'primary-foreground';
</script>

<div
  class="w-full bg-{bgColor} flex items-center gap-3 p-4 text-sm text-{textColor} [&>svg]:text-{textColor}"
  transition:fly={{ y: 100, delay: 100 }}
>
  <div>
    {#if type === 'success'}
      <CheckCircled class="h-6 w-6" />
    {:else if type === 'error'}
      <CrossCircled class="h-6 w-6" />
    {:else if type === 'warning'}
      <ExclamationTriangle class="h-6 w-6" />
    {/if}
  </div>
  <div>
    <h3 class="mb-1 leading-none font-medium tracking-tight">
      {title}
    </h3>
    <p class="text-sm leading-relaxed">
      {message}
    </p>
  </div>
</div>
