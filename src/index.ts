import type { Linter } from 'eslint'
import { resolve } from 'node:path'

import { sortImportsConfig } from './sorting'

type Options = {
  typescript?: boolean
  vue?: boolean
  srcFolder?: string
}

const TypescriptOptions = {
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  'ts/consistent-type-definitions': 'off',
  'ts/no-use-before-define': 'off',
}

const VueOptions = {
  'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
  'vue/html-self-closing': ['error', {
    html: {
      void: 'never',
      normal: 'never',
      component: 'always',
    },
    svg: 'always',
    math: 'always',
  }],
  'vue/max-attributes-per-line': ['error', {
    multiline: { max: 1 },
    singleline: { max: 3 },
  }],
}

export default (options: Options = {}) => {
  const srcFolder = options.srcFolder ?? resolve(process.cwd(), './src')

  let customRules = {
    'antfu/if-newline': 'off',
    'antfu/top-level-function': 'off',
    'brace-style': ['error', '1tbs'],
    'import/no-named-default': 'off',
    'no-useless-return': 'off',
    'node/prefer-global/process': 'off',
    'perfectionist/sort-imports': [
      'error',
      sortImportsConfig(srcFolder),
    ],
    'regexp/no-unused-capturing-group': 'off',
    'style/arrow-parens': ['error', 'as-needed'],
    'style/brace-style': ['error', '1tbs'],
    'style/operator-linebreak': ['error', 'before', {
      overrides: {
        '*=': 'after',
        '+=': 'after',
        '-=': 'after',
        '/=': 'after',
        '=': 'after',
      },
    }],
    'style/quote-props': ['error', 'as-needed'],
  }

  if (options?.typescript) customRules = { ...customRules, ...TypescriptOptions }
  if (options?.vue) customRules = { ...customRules, ...VueOptions }

  return customRules as unknown as Partial<Linter.RulesRecord>
}
