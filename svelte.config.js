import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),

    experimental: {
      remoteFunctions: true
    },

    alias: {
      $components: 'src/lib/components',
      '$components/*': 'src/lib/components/*',

      $models: 'src/lib/db/models',
      '$models/*': 'src/lib/db/models/*',

      $remote: 'src/lib/remote',
      '$remote/*': 'src/lib/remote/*',

      $queries: 'src/lib/db/queries',
      '$queries/*': 'src/lib/db/queries/*'
    }
  },

  compilerOptions: {
    experimental: {
      async: true
    }
  },

  preprocess: vitePreprocess()
};

export default config;
