import nkzw from '@nkzw/oxlint-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
  },
  fmt: {
    experimentalSortImports: {
      newlinesBetween: false,
    },
    experimentalSortPackageJson: {
      sortScripts: true,
    },
    ignorePatterns: ['coverage/', 'dist/', 'pnpm-lock.yaml', 'src/graphql/schema.graphql'],
    singleQuote: true,
  },
  lint: {
    extends: [nkzw],
    ignorePatterns: ['dist/', 'src/prisma/pothos-types.ts', 'src/prisma/prisma-client/**'],
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ['scripts/**/*.tsx', 'src/app.tsx', 'src/index.tsx', 'src/prisma/seed.tsx'],
        rules: {
          'no-console': 'off',
        },
      },
    ],
    rules: {
      'import-x-js/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            './prisma.config.ts',
            './scripts/**/*.tsx',
            './src/index.test.tsx',
            './vite.config.ts',
          ],
        },
      ],
    },
  },
  pack: {
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
    },
    entry: ['./src/app.tsx'],
    outputOptions: {
      codeSplitting: false,
      entryFileNames: 'index.js',
    },
  },
  run: {
    tasks: {
      'test:all': {
        command: 'vp check && vp test',
      },
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
});
