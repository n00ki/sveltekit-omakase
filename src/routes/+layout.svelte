<script>
  // Stores
  import { page } from '$app/state';

  // Utils
  import { onNavigate } from '$app/navigation';
  import { getFlash } from 'sveltekit-flash-message/client';
  import { imageFileUploadState } from '$lib/utils/helpers/uploadFile.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { toast } from 'svelte-sonner';

  // Components
  import SEO from '$components/SEO.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import ThemeSwitcher from '$components/ThemeSwitcher.svelte';

  // Styles
  import '../styles/app.css';

  let { children } = $props();

  const flash = getFlash(page, {
    clearOnNavigate: true,
    clearAfterMs: 3000,
    clearArray: true
  });

  $effect(() => {
    if (!$flash) return;

    switch ($flash.type) {
      case 'success':
        toast.success($flash.message);
        break;
      case 'error':
        toast.error($flash.message);
        break;
      case 'warning':
        toast.warning($flash.message);
        break;
      case 'info':
        toast.info($flash.message);
        break;
    }

    // Clear the flash message to avoid double-toasting.
    $flash = undefined;
  });

  // Reset file upload status store on navigation
  onNavigate(() => {
    imageFileUploadState.reset();
  });
</script>

<SEO {...page.data.metadata} url={page.url.href} />

<ModeWatcher />

<Toaster position="top-right" richColors />

<main>
  {@render children?.()}

  <div class="fixed right-5 bottom-5">
    <ThemeSwitcher />
  </div>
</main>
