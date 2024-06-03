<script lang="ts">
  // Stores
  import { page } from '$app/stores';

  // Utils
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { themes } from '$lib/utils/themes';
  import { browser } from '$app/environment';

  // Components
  import { Button } from '$components/ui/button';

  // Icons
  import { Sun, Moon } from 'svelte-radix';

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
      type="submit"
      aria-label="Switch to light theme"
      formaction="/theme?/set&theme={themes.light}&redirect={$page.url.pathname}"
      variant="outline"
      size="icon"
      class="rounded-r-none border-r-0"
    >
      <Sun size={16} />
    </Button>
  {:else}
    <Button
      id="dark-theme-switcher"
      type="submit"
      aria-label="Switch to dark theme"
      formaction="/theme?/set&theme={themes.dark}&redirect={$page.url.pathname}"
      variant="outline"
      size="icon"
      class="rounded-r-none border-r-0"
    >
      <Moon size={16} />
    </Button>
  {/if}
</form>
