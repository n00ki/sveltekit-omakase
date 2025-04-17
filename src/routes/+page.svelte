<script>
  // Components
  import { Button } from '$components/ui/button';

  // Assets
  import logo from '$lib/assets/logo.png';
  import { GithubLogo } from 'svelte-radix';
  import {
    Database,
    HardDrive,
    Mail,
    Mountain,
    Paintbrush,
    Palette,
    Rocket,
    Shield,
    Ship,
    Snowflake,
    Sparkles,
    Zap
  } from 'lucide-svelte';
</script>

<div class="flex min-h-screen flex-col items-center gap-8 px-4 py-8">
  <nav class="flex w-full max-w-3xl items-center justify-between">
    <div>
      <Button href="https://github.com/n00ki/sveltekit-omakase" target="_blank" variant="outline">
        <GithubLogo size="16" />
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
      <h1 class="font-secondary mb-1.5 text-3xl font-black md:text-6xl">SvelteKit Omakase</h1>
      <h2 class="text-base font-medium tracking-tight md:text-lg">
        everything you need to get up and running with SvelteKit 🚀
      </h2>
    </section>

    <section class="w-full max-w-3xl">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <a
          href="https://svelte.dev/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Sparkles size="18" class="text-muted-foreground" />
          <span class="font-medium">Svelte 5</span>
        </a>
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Palette size="18" class="text-muted-foreground" />
          <span class="font-medium">TailwindCSS 4</span>
        </a>
        <a
          href="https://orm.drizzle.team/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Database size="18" class="text-muted-foreground" />
          <span class="font-medium">Drizzle ORM</span>
        </a>
        <a
          href="https://turso.tech/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Zap size="18" class="text-muted-foreground" />
          <span class="font-medium">Turso</span>
        </a>
        <a
          href="https://www.shadcn-svelte.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Paintbrush size="18" class="text-muted-foreground" />
          <span class="font-medium">shadcn-svelte</span>
        </a>
        <a
          href="https://oslojs.dev/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Mountain size="18" class="text-muted-foreground" />
          <span class="font-medium">Oslo</span>
        </a>
        <a
          href="https://arcticjs.dev/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Snowflake size="18" class="text-muted-foreground" />
          <span class="font-medium">Arctic</span>
        </a>
        <a
          href="https://sailkit.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Ship size="18" class="text-muted-foreground" />
          <span class="font-medium">SailKit</span>
        </a>
        <a
          href="https://resend.com/home"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Mail size="18" class="text-muted-foreground" />
          <span class="font-medium">Resend</span>
        </a>
        <a
          href="https://zod.dev/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Shield size="18" class="text-muted-foreground" />
          <span class="font-medium">Zod</span>
        </a>
        <a
          href="https://superforms.rocks/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <Rocket size="18" class="text-muted-foreground" />
          <span class="font-medium">SuperForms</span>
        </a>
        <a
          href="https://aws.amazon.com/s3/"
          target="_blank"
          rel="noopener noreferrer"
          class="group border-border hover:bg-muted focus-visible:outline-primary flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm"
        >
          <HardDrive size="18" class="text-muted-foreground" />
          <span class="font-medium">AWS S3</span>
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
