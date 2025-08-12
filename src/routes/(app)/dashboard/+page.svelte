<script lang="ts">
  import PlaceholderPattern from '$components/placeholder-pattern.svelte';
</script>

<div class="grid grid-cols-1 gap-4 p-4 md:h-full md:grid-cols-3 md:grid-rows-[auto_1fr]">
  {#each Array(3)}
    <div class="relative aspect-video overflow-hidden rounded-xl border border-border/70">
      <PlaceholderPattern class="absolute inset-0 size-full stroke-muted-foreground/20" />
    </div>
  {/each}
  <div class="relative col-span-3 hidden overflow-hidden rounded-xl border border-border/70 md:block">
    <PlaceholderPattern class="absolute inset-0 size-full stroke-muted-foreground/20" />
  </div>
</div>
