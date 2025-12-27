<script>
  import ThemeSwitch from '$components/theme-switch.svelte';
  import { Button } from '$components/ui/button';

  import { Flame } from '@lucide/svelte';
</script>

<div class="flex min-h-screen flex-col items-center gap-8 px-4 py-8">
  <nav class="flex w-full max-w-3xl items-center justify-between">
    <div>
      <Flame size="24" class="text-orange-500" />
    </div>
    <div class="flex items-center gap-2">
      <Button href="/login" variant="ghost">Login</Button>
      <Button href="/register" variant="outline">Register</Button>
    </div>
  </nav>

  <div class="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8">
    <section class="text-center">
      <h1 class="mb-1.5 font-secondary text-3xl font-black md:text-6xl">kumbaya.dev</h1>
      <h2 class="text-base font-medium tracking-tight md:text-lg">
        <span class="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent"
          >Light a Fire. Gather Around. Build Together.</span
        >
      </h2>
    </section>

    <section class="w-full max-w-xl text-center">
      <p class="text-muted-foreground">
        Stay accountable through public intention, supportive peers, and visible progress. Replace toxic hustle culture
        with positive accountability.
      </p>
    </section>
  </div>
</div>

<div class="fixed right-5 bottom-5">
  <ThemeSwitch />
</div>
