//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: [
      '**/.output/**',
      '**/.nitro/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/node_modules/**',
      // Config/build scripts are not part of TS project referenced by parserOptions.project
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.ts',
    ],
  },
]

