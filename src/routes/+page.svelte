<script>
  import ThemeSwitch from '$components/theme-switch.svelte';
  import { Button } from '$components/ui/button';

  import {
    Database,
    Dog,
    DoorClosedLocked,
    Github,
    HardDrive,
    Mail,
    Paintbrush,
    Palette,
    Rocket,
    Shield,
    Ship,
    Sparkles,
    Zap
  } from '@lucide/svelte';
  import logo from '$lib/assets/logo.png';
</script>

<div class="flex min-h-screen flex-col items-center gap-8 px-4 py-8">
  <nav class="flex w-full max-w-3xl items-center justify-between">
    <div>
      <Button href="https://github.com/n00ki/sveltekit-omakase" target="_blank" variant="outline">
        <Github size="16" />
      </Button>
    </div>
    <div class="flex items-center gap-2">
      <Button href="/login" variant="ghost">Login</Button>
      <Button href="/register" variant="outline">Register</Button>
    </div>
  </nav>

  <div class="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8">
    <section class="text-center">
      <img src={logo} alt="logo" class="mx-auto size-16 md:size-24" />
      <h1 class="mb-1.5 font-secondary text-3xl font-black md:text-6xl">SvelteKit Omakase</h1>
      <h2 class="text-base font-medium tracking-tight md:text-lg">
        the ultimate <span class=" bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent"
          >mise en place</span
        > for your next SvelteKit project 🚀
      </h2>
    </section>

    <section class="w-full max-w-3xl">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <a
          href="https://svelte.dev/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Sparkles size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Svelte 5</span>
        </a>
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Palette size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">TailwindCSS 4</span>
        </a>
        <a
          href="https://orm.drizzle.team/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Database size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Drizzle ORM</span>
        </a>
        <a
          href="https://turso.tech/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Zap size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Turso</span>
        </a>
        <a
          href="https://www.shadcn-svelte.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Paintbrush size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">shadcn-svelte</span>
        </a>
        <a
          href="https://www.better-auth.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <DoorClosedLocked size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Better-Auth</span>
        </a>
        <a
          href="https://sailkit.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Ship size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">SailKit</span>
        </a>
        <a
          href="https://resend.com/home"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Mail size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Resend</span>
        </a>
        <a
          href="https://zod.dev/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Shield size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Zod</span>
        </a>
        <a
          href="https://superforms.rocks/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Rocket size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">SuperForms</span>
        </a>
        <a
          href="https://www.cloudflare.com/r2/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <HardDrive size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Cloudflare R2</span>
        </a>
        <a
          href="https://typicode.github.io/husky/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted hover:shadow-sm focus-visible:outline-primary"
        >
          <Dog size="18" class="text-muted-foreground group-hover:text-orange-400" />
          <span class="font-medium">Husky</span>
        </a>
      </div>
    </section>

    <section class="w-full max-w-3xl">
      <h2 class="text-sm font-light">
        Inspired by the <a
          href="https://rubyonrails.org/doctrine#omakase"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground"
        >
          Rails doctrine
        </a>, <em>SvelteKit Omakase</em> offers an opinionated selection of tools and a structured approach for your next
        web application. It provides a robust foundation with carefully chosen defaults, while preserving the flexibility
        to customize and extend as your project needs evolve.
      </h2>
    </section>
  </div>
</div>

<div class="fixed right-5 bottom-5">
  <ThemeSwitch />
</div>
