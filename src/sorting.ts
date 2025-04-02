import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

import type { ExtendedOptions } from './types'

type Folder = {
  path: string
  folderName: string
}

type ImportGroup = string[] | { newlinesBetween: string }

const ignoreFolders = [
  '.git',
  '.nuxt',
  '.next',
  '.astro',
  '.vscode',
  '.idea',
  '.lab',
  '.cache',
  '.db',
  '.mails',
  '.output',
  'output',
  'dist',
  'node_modules',
]

const parseSourceFolder = (srcFolder: string, options: ExtendedOptions = {}) => {
  const folders = readdirSync(srcFolder)
    .filter(el => !ignoreFolders.includes(el))
    .reduce<Folder[]>((acc, pathToInput) => {
      const path = resolve(srcFolder, pathToInput)
      if (statSync(path).isDirectory()) {
        acc.push({
          path,
          folderName: pathToInput.split('/').slice(-1)[0],
        })
      }
      return acc
    }, [])

  const CUSTOM_GROUPS: Record<string, string[]> = {
    '@/react': ['^react$', '^react-.*', '^@react/.*'],
    '@/vue': ['^vue$', '^vue-.*', '^@vue/.*', 'vuex'],
    '@/vueuse': ['^vueuse$', '^vueuse-.*', '^@vueuse/.*'],
    '@/nuxt': ['^nuxt$', '^nuxt-.*', '^@nuxt/.*'],
  }

  folders.forEach(({ folderName }) => {
    if (CUSTOM_GROUPS[`@/${folderName}`]) {
      return
    }
    CUSTOM_GROUPS[`@/${folderName}`] = [
      `^@/${folderName}$`,
      `@/${folderName}/+`,
      `^@@/${folderName}$`,
      `@@/${folderName}/+`,
      `~/${folderName}$`,
      `~/${folderName}/+`,
      `~~/${folderName}$`,
      `~~/${folderName}/+`,
    ]
  })

  const aliasesAppRelated = options?.aliasesAppRelated || []
  const aliasesLayoutRelated = options?.aliasesAppRelated || []
  const aliasesComponentsRelated = options?.aliasesAppRelated || []
  const aliasesConstantsRelated = options?.aliasesAppRelated || []
  const aliasesFunctionsRelated = options?.aliasesAppRelated || []
  const aliasesTypesRelated = options?.aliasesAppRelated || []

  const aliasMap = (el: string) => {
    if (!CUSTOM_GROUPS[el]) CUSTOM_GROUPS[el] = [`^${el}$`, `^${el}/+`]
  }

  if (aliasesAppRelated.length) aliasesAppRelated.forEach(aliasMap)
  if (aliasesLayoutRelated.length) aliasesLayoutRelated.forEach(aliasMap)
  if (aliasesComponentsRelated.length) aliasesComponentsRelated.forEach(aliasMap)
  if (aliasesConstantsRelated.length) aliasesConstantsRelated.forEach(aliasMap)
  if (aliasesFunctionsRelated.length) aliasesFunctionsRelated.forEach(aliasMap)
  if (aliasesTypesRelated.length) aliasesTypesRelated.forEach(aliasMap)

  const DEFAULT_ALREADY_SORTED = [
    '@/types',
    '@/server',
    '@/middleware',
    '@/providers',
    '@/modules',
    '@/plugins',
    '@/app',
    '@/assets',
    '@/public',
    '@/store',
    '@/stores',
    '@/constants',
    '@/enums',
    '@/functions',
    '@/utils',
    '@/lib',
    '@/hooks',
    '@/templates',
    '@/layouts',
    '@/pages',
    '@/components',
    '@/main',
    '@/index',
    //
    '@/vue',
    '@/vueuse',
    '@/nuxt',
    '@/react',
  ]

  const canSafelyAddInternalAlias = (folderAlias: string) => {
    if (!CUSTOM_GROUPS[folderAlias]) return undefined
    return folderAlias
  }

  const canSafelyAddPassedAlias = (folderAlias: string) => {
    if (DEFAULT_ALREADY_SORTED.includes(folderAlias)) return undefined
    if (!CUSTOM_GROUPS[folderAlias]) return undefined
    return folderAlias
  }

  const alreadySortedSet = new Set([
    ...DEFAULT_ALREADY_SORTED,
    ...aliasesAppRelated,
    ...aliasesLayoutRelated,
    ...aliasesComponentsRelated,
    ...aliasesConstantsRelated,
    ...aliasesFunctionsRelated,
    ...aliasesTypesRelated,
  ])

  const unsortedAliasses = Object.keys(CUSTOM_GROUPS).filter(alias => !alreadySortedSet.has(alias))

  return {
    CUSTOM_GROUPS,
    unsortedAliasses,
    aliasesAppRelated,
    aliasesLayoutRelated,
    aliasesComponentsRelated,
    aliasesConstantsRelated,
    aliasesFunctionsRelated,
    aliasesTypesRelated,
    canSafelyAddInternalAlias,
    canSafelyAddPassedAlias,
  }
}

export const sortImportsConfig = (srcFolder: string, options: ExtendedOptions = {}) => {
  const {
    CUSTOM_GROUPS,
    unsortedAliasses,
    aliasesAppRelated,
    aliasesLayoutRelated,
    aliasesComponentsRelated,
    aliasesConstantsRelated,
    aliasesFunctionsRelated,
    aliasesTypesRelated,
    canSafelyAddInternalAlias,
    canSafelyAddPassedAlias,
  } = parseSourceFolder(srcFolder, options)

  const unparsedGroups = [
    ['side-effect-style', 'side-effect'],
    { newlinesBetween: 'always' },
    // --- New line here ---
    ['@/vue'],
    ['@/vueuse'],
    ['@/nuxt'],
    ['@/react'],
    [
      'builtin-type',
      'builtin',
    ],
    [
      'external-type',
      'type',
      'external',
      'unknown',
    ],
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      'parent-type',
      'sibling-type',
      'index-type',
      'parent',
      'sibling',
      'index',
    ],
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      'internal-type',
      canSafelyAddInternalAlias('@/types'),
      ...(aliasesTypesRelated || []).map(canSafelyAddPassedAlias),
    ].filter(Boolean),
    ['internal'],
    [
      ...unsortedAliasses,
      canSafelyAddInternalAlias('@/app'),
      canSafelyAddInternalAlias('@/assets'),
      canSafelyAddInternalAlias('@/index'),
      canSafelyAddInternalAlias('@/public'),
      canSafelyAddInternalAlias('@/main'),
      canSafelyAddInternalAlias('@/middleware'),
      canSafelyAddInternalAlias('@/modules'),
      canSafelyAddInternalAlias('@/plugins'),
      canSafelyAddInternalAlias('@/providers'),
      canSafelyAddInternalAlias('@/server'),
      canSafelyAddInternalAlias('@/store'),
      canSafelyAddInternalAlias('@/stores'),
      ...(aliasesAppRelated || []).map(canSafelyAddPassedAlias),
    ].filter(Boolean),
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      canSafelyAddInternalAlias('@/layouts'),
      canSafelyAddInternalAlias('@/pages'),
      ...(aliasesLayoutRelated || []).map(canSafelyAddPassedAlias),
    ].filter(Boolean),
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      canSafelyAddInternalAlias('@/components'),
      canSafelyAddInternalAlias('@/templates'),
      ...(aliasesComponentsRelated || []).map(canSafelyAddPassedAlias),
    ].filter(Boolean),
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      canSafelyAddInternalAlias('@/constants'),
      canSafelyAddInternalAlias('@/enums'),
      canSafelyAddInternalAlias('@/functions'),
      canSafelyAddInternalAlias('@/hooks'),
      canSafelyAddInternalAlias('@/lib'),
      canSafelyAddInternalAlias('@/utils'),
      ...(aliasesConstantsRelated || []).map(canSafelyAddPassedAlias),
      ...(aliasesFunctionsRelated || []).map(canSafelyAddPassedAlias),
    ].filter(Boolean),
    { newlinesBetween: 'always' },
    // --- New line here ---
    ['object'],
  ] as ImportGroup[]

  const groups = unparsedGroups.reduce((acc, next, index) => {
    let result = index === 0
    if (index > 0) {
      const last = acc[acc.length - 1]
      if (Array.isArray(next))
        result = next.length > 0
      else if (Array.isArray(last))
        result = true
    }
    if (result) {
      acc.push(next)
    }
    return acc
  }, [] as ImportGroup[])

  const config = {
    customGroups: {
      type: { ...CUSTOM_GROUPS },
      value: { ...CUSTOM_GROUPS },
    },
    sortSideEffects: false,
    specialCharacters: 'keep',
    internalPattern: [
      '^@/.*',
      '^@@/.*',
      '^~/.*',
      '^~~/.*',
    ],
    newlinesBetween: 'never',
    groups,
  }

  return config
}
