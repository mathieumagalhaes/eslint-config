import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

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

const parseSourceFolder = (srcFolder: string) => {
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

  return { CUSTOM_GROUPS }
}

export const sortImportsConfig = (srcFolder: string) => {
  const { CUSTOM_GROUPS } = parseSourceFolder(srcFolder)

  const existsOrUndefined = (folderAlias: string) => {
    return CUSTOM_GROUPS[folderAlias] ? folderAlias : undefined
  }

  const alreadySorted = [
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
    '@/functions',
    '@/utils',
    '@/lib',
    '@/hooks',
    '@/templates',
    '@/layouts',
    '@/pages',
    '@/components',
    //
    '@/vue',
    '@/vueuse',
    '@/nuxt',
    '@/react',
  ]

  const unsortedAliasses = Object.keys(CUSTOM_GROUPS).filter(alias => !alreadySorted.includes(alias))

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
      'external-type',
      'type',
      'builtin',
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
      'internal',
      ...unsortedAliasses,
      existsOrUndefined('@/app'),
      existsOrUndefined('@/assets'),
      existsOrUndefined('@/public'),
      existsOrUndefined('@/middleware'),
      existsOrUndefined('@/modules'),
      existsOrUndefined('@/plugins'),
      existsOrUndefined('@/providers'),
      existsOrUndefined('@/server'),
      existsOrUndefined('@/store'),
      existsOrUndefined('@/stores'),
      existsOrUndefined('@/types'),
    ].filter(Boolean),
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      existsOrUndefined('@/layouts'),
      existsOrUndefined('@/pages'),
    ].filter(Boolean),
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      existsOrUndefined('@/components'),
      existsOrUndefined('@/templates'),
    ].filter(Boolean),
    { newlinesBetween: 'always' },
    // --- New line here ---
    [
      existsOrUndefined('@/constants'),
      existsOrUndefined('@/functions'),
      existsOrUndefined('@/hooks'),
      existsOrUndefined('@/lib'),
      existsOrUndefined('@/utils'),
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
