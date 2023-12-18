<script lang="ts">
  import { fly } from 'svelte/transition';
  import * as Alert from '$lib/components/ui/alert';
  import { CheckCircled, ExclamationTriangle, CrossCircled } from 'radix-icons-svelte';

  export let type: 'success' | 'error' | 'warning';
  const title: string = type === 'success' ? 'Success!' : type === 'error' ? 'Oops...' : 'Warning!';
  export let message: string;
</script>

<div class="flash" transition:fly={{ y: 100, delay: 100 }}>
  <Alert.Root variant={type === 'error' ? 'destructive' : 'default'} class="m-0 rounded-none">
    {#if type === 'success'}
      <CheckCircled class="h-6 w-6" />
    {:else if type === 'error'}
      <CrossCircled class="h-6 w-6" />
    {:else if type === 'warning'}
      <ExclamationTriangle class="h-6 w-6" />
    {/if}
    <Alert.Title>{title}</Alert.Title>
    <Alert.Description>{message}</Alert.Description>
  </Alert.Root>
</div>
