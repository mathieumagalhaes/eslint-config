import antfu from '@antfu/eslint-config'

import customRules from './src'

export default antfu({
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
  ],

  rules: {
    ...customRules({ vue: true, typescript: true }),
  },
})
