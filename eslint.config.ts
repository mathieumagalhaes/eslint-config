import { resolve } from 'node:path'
import antfu from '@antfu/eslint-config'

import mathieumagalhaes from './src'

export default antfu(mathieumagalhaes({
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

  srcFolder: resolve(import.meta.dirname, './src'),
  preferAtPrefixImportsRules: true,
  doNotSetDefaultIgnores: true,

  aliasesTypesRelated: [],
  aliasesAppRelated: [],
  aliasesLayoutRelated: [],
  aliasesComponentsRelated: [],
  aliasesConstantsRelated: [],
  aliasesFunctionsRelated: [],
}))
