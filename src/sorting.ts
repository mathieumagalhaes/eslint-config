import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

interface Folder {
  path: string
  folderName: string
}

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

  const CUSTOM_GROUPS: Record<string, string[]> = {}
  folders.forEach(({ folderName }) => {
    CUSTOM_GROUPS[`@/${folderName}`] = [
      `^@/${folderName}$`,
      `@/${folderName}/+`,
      `~/${folderName}$`,
      `~/${folderName}/+`,
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
    '@/providers',
    '@/modules',
    '@/plugins',
    '@/public',
    '@/stores',
    '@/constants',
    '@/functions',
    '@/utils',
    '@/hooks',
    '@/layouts',
    '@/pages',
    '@/components',
  ]

  const unsortedAliasses = Object.keys(CUSTOM_GROUPS).filter(alias => !alreadySorted.includes(alias))

  return {
    customGroups: {
      type: { ...CUSTOM_GROUPS },
      value: { ...CUSTOM_GROUPS },
    },
    groups: [
      [
        'type',
        'internal-type',
        'parent-type',
        'sibling-type',
        'index-type',
        existsOrUndefined('@/types'),
      ].filter(Boolean),
      [
        'internal',
        'external',
        'builtin',
        'parent',
        'index',
        'object',
        'unknown',
      ].filter(Boolean),
      'sibling',
      [
        existsOrUndefined('@/server'),
        existsOrUndefined('@/providers'),
        existsOrUndefined('@/modules'),
        existsOrUndefined('@/plugins'),
        existsOrUndefined('@/public'),
      ].filter(Boolean),
      unsortedAliasses,
      [
        existsOrUndefined('@/constants'),
        existsOrUndefined('@/functions'),
        existsOrUndefined('@/utils'),
        existsOrUndefined('@/hooks'),
      ].filter(Boolean),
      [
        existsOrUndefined('@/layouts'),
        existsOrUndefined('@/pages'),
      ].filter(Boolean),
      [
        existsOrUndefined('@/components'),
      ].filter(Boolean),
    ].filter(el => (el?.length || 0) > 0),
  }
}
