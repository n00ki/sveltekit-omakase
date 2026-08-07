<script lang="ts">
  import { resolve } from '$app/paths';

  import ThemeSwitch from '$components/theme-switch.svelte';

  import { config } from '$config';

  let { children } = $props();
</script>

<div class="relative isolate min-h-screen overflow-hidden bg-background">
  <div
    class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,var(--color-accent),transparent_75%)] opacity-60"
    aria-hidden="true"
  ></div>
  <div
    class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_25%,transparent_70%)] bg-size-[56px_56px] opacity-[0.28]"
    aria-hidden="true"
  ></div>

  <header class="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-8">
    <a href={resolve('/')} class="font-secondary text-sm font-semibold tracking-tight">{config.app.name}</a>
    <ThemeSwitch />
  </header>

  <main class="flex min-h-screen items-center justify-center px-6 py-24">
    <div class="w-full max-w-95">
      {@render children?.()}
    </div>
  </main>
</div>
