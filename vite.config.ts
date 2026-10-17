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
