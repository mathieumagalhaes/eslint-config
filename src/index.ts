import { resolve } from 'node:path'
import type { OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config'
import searchAndReplace from '@mathieumagalhaes/eslint-plugin-search-and-replace'
import type { Linter } from 'eslint'

import { sortImportsConfig } from './sorting'
import type { ExtendedOptions } from './types'

const DEFAULT_IGNORES = [
  '.git/**',
  '.gitlab/**',
  '.idea/**',
  '.vscode/**',
  '.husky/**',
  'node_modules/**',
  'dist/**',
  'build/**',
  'public/meta/*.json',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
]

const DEFAULT_STYLISITC = {
  indent: 2,
  quotes: 'single' as const,
  semi: false,
  jsx: false,
}

const TypescriptRules = {
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  'ts/consistent-type-definitions': 'off',
  'ts/no-use-before-define': 'off',
}

const VueRules = {
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

const preferAtPrefixImportsRules = {
  'search-and-replace/replace': ['error', {
    search: '~/',
    replace: '@/',
    scope: 'import-path',
  }],
}

const customRules = (options: ExtendedOptions = {}) => {
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
      sortImportsConfig(srcFolder, options),
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

  if (options?.typescript) {
    customRules = { ...customRules, ...TypescriptRules }
  }

  if (options?.vue) {
    customRules = { ...customRules, ...VueRules }
  }

  if (options?.preferAtPrefixImportsRules) {
    customRules = { ...customRules, ...preferAtPrefixImportsRules }
  }

  return customRules as unknown as Partial<Linter.RulesRecord>
}

const customPlugins = (options: ExtendedOptions = {}) => {
  const plugins = {} as ExtendedOptions['plugins']

  if (plugins && options?.preferAtPrefixImportsRules) {
    plugins['search-and-replace'] = searchAndReplace
  }

  return plugins
}

export default function (optionsDTO: ExtendedOptions): OptionsConfig & Omit<TypedFlatConfigItem, 'files'> {
  const options = { ...optionsDTO }

  options.plugins = {
    ...customPlugins(options),
    ...(options.plugins || {}),
  }

  options.rules = {
    ...customRules(options),
    ...(options.rules || {}),
  }

  options.ignores = [
    ...(options.doNotSetDefaultIgnores ? [] : DEFAULT_IGNORES),
    ...(options.ignores || []),
  ]

  options.stylistic = {
    ...DEFAULT_STYLISITC,
    ...(options.stylistic && typeof options.stylistic === 'object' ? options.stylistic : {}),
  }

  return options
}
