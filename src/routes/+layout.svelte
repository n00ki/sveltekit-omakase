<script lang="ts">
  // Stores
  import { page } from '$app/stores';

  // Utils
  import { onNavigate, disableScrollHandling } from '$app/navigation';
  import { getFlash } from 'sveltekit-flash-message/client';
  import { fileUploadStatus } from '$lib/utils/helpers/uploadFile';
  import { ModeWatcher } from 'mode-watcher';

  // Components
  import SEO from '$components/SEO.svelte';
  import Navbar from '$components/Navbar.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import Flash from '$components/Flash.svelte';
  import ThemeSwitcher from '$components/ThemeSwitcher.svelte';

  // Styles
  import '../styles/app.css';

  export let data;

  const flash = getFlash(page, {
    clearOnNavigate: true,
    clearAfterMs: 3000,
    clearArray: true
  });

  // Reset file upload status store on navigation
  onNavigate(() => {
    $fileUploadStatus = 'ready';
  });
</script>

<SEO {...$page.data.metadata} url={$page.url.href} />

<ModeWatcher />

<Toaster position="bottom-center" closeButton />

<Navbar user={data.user} />

<main class="container mx-auto flex flex-1 flex-col p-4 md:px-8 md:py-4">
  <slot />

  <div class="fixed bottom-5 right-0">
    <ThemeSwitcher />
  </div>
</main>

{#if $flash}
  <div class="fixed bottom-0 w-full overflow-hidden">
    <Flash type={$flash.type} message={$flash?.message} />
  </div>
{/if}
