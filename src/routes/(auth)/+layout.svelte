<script lang="ts">
  import Wrapper from '$components/Wrapper.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="flex flex-1 items-center">
  <Wrapper size="lg">
    {@render children?.()}
  </Wrapper>
</div>
