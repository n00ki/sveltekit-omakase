<script lang="ts">
  // Utils
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { themes } from '$lib/utils/themes';
  import { browser } from '$app/environment';

  // Stores
  import { page } from '$app/stores';

  // Components
  import { Button } from '$components/ui/button';

  // Icons
  import { Sun, Moon } from 'radix-icons-svelte';

  let preferredTheme: string = $page.data.theme;

  if (browser && !document.cookie.includes('theme')) {
    let prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    preferredTheme = prefersDark.matches ? themes.dark : themes.light;

    prefersDark.addEventListener('change', (e) => {
      preferredTheme = e.matches ? themes.dark : themes.light;
    });
  }

  const handleSetTheme: SubmitFunction = ({ action }) => {
    const theme = action.searchParams.get('theme');

    if (theme) {
      preferredTheme = theme;
      document.documentElement.setAttribute('class', theme);
    }
  };
</script>

<form method="POST" use:enhance={handleSetTheme}>
  {#if preferredTheme === themes.dark}
    <Button
      id="light-theme-switcher"
      aria-label="Switch to light theme"
      formaction="/theme?/set&theme={themes.light}&redirect={$page.url.pathname}"
      variant="outline"
      size="icon"
      class="rounded-r-none border-r-0"
    >
      <Sun />
    </Button>
  {:else}
    <Button
      id="dark-theme-switcher"
      aria-label="Switch to dark theme"
      formaction="/theme?/set&theme={themes.dark}&redirect={$page.url.pathname}"
      variant="outline"
      size="icon"
      class="rounded-r-none border-r-0"
    >
      <Moon />
    </Button>
  {/if}
</form>
