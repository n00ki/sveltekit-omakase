import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

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
      parserOptions: {
        extraFileExtensions: ['.svelte']
      },
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
        parser: ts.parser
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
]);
