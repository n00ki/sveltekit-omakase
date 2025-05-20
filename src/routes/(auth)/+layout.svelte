<script lang="ts">
  import Wrapper from '$components/Wrapper.svelte';
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
  <Wrapper>
    {@render children?.()}
  </Wrapper>
</div>
