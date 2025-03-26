import type { OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config'
import antfu from '@antfu/eslint-config'
import searchAndReplace from '@mathieumagalhaes/eslint-plugin-search-and-replace'
import type { Linter } from 'eslint'
import { resolve } from 'node:path'

import { sortImportsConfig } from './sorting'

type MyOptions = {
  srcFolder?: string
  PreferAtPrefixImportsRules?: boolean
}

type AntfuOptions = OptionsConfig & Omit<TypedFlatConfigItem, 'files'>
type ExtendedOptions = AntfuOptions & MyOptions

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

const PreferAtPrefixImportsRules = {
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

  if (options?.typescript) {
    customRules = { ...customRules, ...TypescriptRules }
  }

  if (options?.vue) {
    customRules = { ...customRules, ...VueRules }
  }

  if (options?.PreferAtPrefixImportsRules) {
    customRules = { ...customRules, ...PreferAtPrefixImportsRules }
  }

  return customRules as unknown as Partial<Linter.RulesRecord>
}

const customPlugins = (options: ExtendedOptions = {}) => {
  const plugins = {} as ExtendedOptions['plugins']

  if (plugins && options?.PreferAtPrefixImportsRules) {
    plugins['search-and-replace'] = searchAndReplace
  }

  return plugins
}

export default function (optionsDTO: ExtendedOptions): ReturnType<typeof antfu> {
  const options = { ...optionsDTO }

  options.plugins = {
    ...customPlugins(options),
    ...(options.plugins || {}),
  }

  options.rules = {
    ...customRules(options),
    ...(options.rules || {}),
  }

  return antfu(options)
}
