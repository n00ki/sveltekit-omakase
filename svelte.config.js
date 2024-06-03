import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),

    alias: {
      $components: 'src/lib/components',
      '$components/*': 'src/lib/components/*',

      $models: 'src/lib/db/models',
      '$models/*': 'src/lib/db/models/*',

      $queries: 'src/lib/db/queries',
      '$queries/*': 'src/lib/db/queries/*'
    }
  },

  preprocess: vitePreprocess()
};

export default config;
