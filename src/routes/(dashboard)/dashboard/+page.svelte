<script lang="ts">
  import PlaceholderPattern from '$components/PlaceholderPattern.svelte';
</script>

<div class="grid grid-cols-1 gap-4 p-4 md:h-full md:grid-cols-3 md:grid-rows-[auto_1fr]">
  {#each Array(3)}
    <div class="border-border/70 relative aspect-video overflow-hidden rounded-xl border">
      <PlaceholderPattern class="stroke-muted-foreground/20 absolute inset-0 size-full" />
    </div>
  {/each}
  <div class="border-border/70 relative col-span-3 hidden overflow-hidden rounded-xl border md:block">
    <PlaceholderPattern class="stroke-muted-foreground/20 absolute inset-0 size-full" />
  </div>
</div>
