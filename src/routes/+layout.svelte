<script>
  // Stores
  import { page } from '$app/state';

  // Utils
  import { onNavigate } from '$app/navigation';
  import { getFlash } from 'sveltekit-flash-message/client';
  import { fileUploadState } from '$lib/utils/helpers/uploadFile.svelte';
  import { ModeWatcher } from 'mode-watcher';

  // Components
  import SEO from '$components/SEO.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import Flash from '$components/Flash.svelte';
  import ThemeSwitcher from '$components/ThemeSwitcher.svelte';

  // Styles
  import '../styles/app.css';

  let { children } = $props();

  const flash = getFlash(page, {
    clearOnNavigate: true,
    clearAfterMs: 3000,
    clearArray: true
  });

  // Reset file upload status store on navigation
  onNavigate(() => {
    fileUploadState.reset();
  });
</script>

<SEO {...page.data.metadata} url={page.url.href} />

<ModeWatcher />

<Toaster position="bottom-center" closeButton />

<main>
  {@render children?.()}

  <div class="fixed right-5 bottom-5">
    <ThemeSwitcher />
  </div>
</main>

{#if $flash}
  <div class="fixed bottom-0 z-50 w-full overflow-hidden">
    <Flash type={$flash.type} message={$flash?.message} />
  </div>
{/if}
