import type { OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config'

export type MyOptions = {
  srcFolder?: string
  preferAtPrefixImportsRules?: boolean
  doNotSetDefaultIgnores?: boolean

  aliasesTypesRelated?: string[]
  aliasesAppRelated?: string[]
  aliasesLayoutRelated?: string[]
  aliasesComponentsRelated?: string[]
  aliasesConstantsRelated?: string[]
  aliasesFunctionsRelated?: string[]
}

export type AntfuOptions = OptionsConfig & Omit<TypedFlatConfigItem, 'files'>
export type ExtendedOptions = AntfuOptions & MyOptions
