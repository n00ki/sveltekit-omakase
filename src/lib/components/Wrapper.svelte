<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="w-full px-2 md:px-0">
  <div class="mx-auto max-w-lg">
    {@render children?.()}
  </div>
</div>
