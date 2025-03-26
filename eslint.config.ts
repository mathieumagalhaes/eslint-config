import { resolve } from 'node:path'

import mathieumagalhaes from './src'

export default mathieumagalhaes({
  type: 'app',
  vue: true,
  typescript: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  ignores: [
    'node_modules/**',
    'dist/**',
    'package.json',
    'pnpm-lock.yaml',
    'tsconfig*.json',
    'vite.config.ts',
    './*.md',
  ],

  srcFolder: resolve(import.meta.dirname, './src'),
  PreferAtPrefixImportsRules: true,
})
