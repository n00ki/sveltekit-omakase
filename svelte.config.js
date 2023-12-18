import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),

    alias: {
      $components: 'src/lib/components',
      '$components/*': 'src/lib/components/*'
    }
  },

  preprocess: vitePreprocess()
};

export default config;
