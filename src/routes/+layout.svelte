<script>
  // Stores
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { ModeWatcher } from 'mode-watcher';
  import { toast } from 'svelte-sonner';
  // Utils
  import { getFlash } from 'sveltekit-flash-message/client';

  import { imageFileUploader } from '$lib/utils/helpers/upload-file.svelte';

  // Components
  import AppHead from '$components/app-head.svelte';
  import { Toaster } from '$components/ui/sonner';

  import { imageFileUploader } from '$lib/utils/helpers/upload-file.svelte';

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

    return () => {
      // Clear the flash message to avoid double-toasting.
      $flash = undefined;
    };
  });

  // Reset file upload status on navigation
  onNavigate(() => {
    imageFileUploader.reset();
  });
</script>

<AppHead {...page.data.metadata} url={page.url.href} />

<ModeWatcher />

<Toaster position="bottom-right" richColors />

<main>
  {@render children?.()}
</main>
