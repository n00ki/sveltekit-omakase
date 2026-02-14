import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.{js,ts,svelte}'],
    ignores: ['**/+*', '**/db/migrations/**'],
    plugins: {
      'check-file': checkFile
    },
    rules: {
      'check-file/filename-naming-convention': ['error', { '**/*': 'KEBAB_CASE' }, { ignoreMiddleExtensions: true }]
    }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: ts.parser,
        svelteConfig
      }
    },
    rules: {
      'svelte/no-navigation-without-resolve': [
        'error',
        {
          ignoreLinks: true
        }
      ]
    }
  }
  // Disable rules for shadcn-svelte UI components (OPTIONAL)
  // {
  //   ignores: ['src/lib/components/ui/**']
  // }
]);
