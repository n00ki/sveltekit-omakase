import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'vite build && vite preview',
    port: 4173
  },
  testDir: 'tests/e2e'
});
