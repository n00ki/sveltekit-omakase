<script lang="ts">
  // Stores
  import { page } from '$app/state';

  // Utils
  import { cn } from '$lib/utils/utils';
  import { crossfade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  // Components
  import { Button } from '$components/ui/button';

  interface Props {
    class?: string | undefined | null;
    items: { href: string; title: string }[];
  }

  let { class: className = undefined, items }: Props = $props();

  const [send, receive] = crossfade({
    duration: 250,
    easing: cubicInOut
  });
</script>

<nav class={cn('flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0', className)}>
  {#each items as item (item.title)}
    {@const isActive = page.url.pathname === item.href}

    <Button
      href={item.href}
      variant="ghost"
      class={cn(!isActive && 'hover:underline', 'relative justify-start hover:bg-transparent')}
      data-sveltekit-noscroll
    >
      {#if isActive}
        <div
          class="absolute inset-0 rounded-md bg-muted"
          in:send={{ key: 'active-sidebar-tab' }}
          out:receive={{ key: 'active-sidebar-tab' }}
        ></div>
      {/if}
      <div class="relative">
        {item.title}
      </div>
    </Button>
  {/each}
</nav>
