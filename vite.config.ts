import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter(),

      experimental: {
        remoteFunctions: true
      },

      alias: {
        '$config/server': 'src/lib/config/config.server.ts',

        $config: 'src/lib/config/config.ts',

        $messages: 'src/lib/config/messages',
        '$messages/*': 'src/lib/config/messages/*',

        $components: 'src/lib/components',
        '$components/*': 'src/lib/components/*',

        $models: 'src/lib/db/models',
        '$models/*': 'src/lib/db/models/*',

        $remote: 'src/lib/remote',
        '$remote/*': 'src/lib/remote/*',

        $queries: 'src/lib/db/queries',
        '$queries/*': 'src/lib/db/queries/*'
      },

      compilerOptions: {
        experimental: {
          async: true
        }
      },

      preprocess: vitePreprocess()
    })
  ],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}', 'tests/unit/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'tests/e2e/**']
        }
      }
    ]
  }
}));
