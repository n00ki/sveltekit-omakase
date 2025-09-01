<script lang="ts">
  import ThemeSwitch from '$components/theme-switch.svelte';
  import { Button } from '$components/ui/button';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<nav class="fixed w-full p-2">
  <div>
    <Button href="/" variant="ghost" class="font-secondary text-lg font-semibold">SvelteKit Omakase</Button>
  </div>
</nav>

<div class="flex min-h-screen items-center justify-center">
  <div class="w-full px-2 md:px-0">
    <div class="mx-auto max-w-lg rounded-2xl border bg-accent/30 p-1.5 outline-none">
      {@render children?.()}
    </div>
  </div>
</div>

<div class="fixed right-5 bottom-5">
  <ThemeSwitch />
</div>
