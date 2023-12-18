<script lang="ts">
  // Utils
  import { onNavigate, disableScrollHandling } from '$app/navigation';
  import { getFlash } from 'sveltekit-flash-message/client';

  // Stores
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { jsStatus } from '$lib/stores/js_status';

  // Components
  import SEO from '$components/SEO.svelte';
  import Navbar from '$components/Navbar.svelte';
  import { Toaster } from 'svelte-french-toast';
  import Flash from '$components/Flash.svelte';
  import ThemeSwitcher from '$components/ThemeSwitcher.svelte';

  // Styles
  import '../styles/app.css';

  export let data;

  const flash = getFlash(page, {
    clearAfterMs: 5000
  });

  if (browser) {
    $jsStatus = 'enabled';
  }

  // Disable scroll handling on same route navigation for theme switching
  onNavigate((navigation) => {
    const previousRoute = navigation.from?.url.pathname;
    const currentRoute = navigation.to?.url.pathname;

    if (previousRoute === currentRoute) {
      disableScrollHandling();
    }
  });
</script>

<SEO {...$page.data.metadata} url={$page.url.href} />

<Toaster />

<div class="flex w-full flex-1 flex-col font-primary">
  <Navbar user={data.user} />

  <main class="container mx-auto flex flex-1 flex-col p-4 md:px-8 md:py-4">
    <slot />

    <div class="fixed bottom-5 right-0">
      <ThemeSwitcher />
    </div>
  </main>
</div>

{#if $flash}
  <div class="fixed bottom-0 w-full overflow-hidden">
    <Flash type={$flash.type} message={$flash?.message} />
  </div>
{/if}
