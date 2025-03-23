import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

interface Folder {
  path: string
  prefix: string
  folderName: string
  extensions: string[]
}

const parseSourceFolder = (srcFolder: string) => {
  const folders = readdirSync(srcFolder)
    .filter(el => !['.git', '.nuxt', 'dist', 'output', '.output', 'node_modules'].includes(el))
    .reduce<Folder[]>((acc, pathToInput) => {
      const path = resolve(srcFolder, pathToInput)
      if (statSync(path).isDirectory()) {
        acc.push({
          path,
          prefix: pathToInput[0].toUpperCase() + pathToInput.substring(1),
          folderName: pathToInput.split('/').slice(-1)[0],
          extensions: ['vue'],
        })
      }
      return acc
    }, [])

  const folderExists = (...folderNames: string[]) => {
    return folders.some(el => folderNames.includes(el.path.split('/').slice(-1)[0]))
  }

  const CUSTOM_GROUPS: Record<string, string[]> = {}
  folders.forEach(({ folderName }) => {
    CUSTOM_GROUPS[`@/${folderName}`] = [
      `^@/${folderName}$`,
      `@/${folderName}/+`,
      `~/${folderName}$`,
      `~/${folderName}/+`,
    ]
  })

  return { CUSTOM_GROUPS, folderExists }
}

export const sortImportsConfig = (srcFolder: string) => {
  const { CUSTOM_GROUPS, folderExists } = parseSourceFolder(srcFolder)

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

  const unsortedAliasses = Object.keys(CUSTOM_GROUPS).reduce<string[]>((acc, key) => {
    if (alreadySorted.includes(key)) return acc
    acc.push(key)
    return acc
  }, [])

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
        folderExists('types') && '@/types',
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
        folderExists('server') && '@/server',
        folderExists('providers') && '@/providers',
        folderExists('modules') && '@/modules',
        folderExists('plugins') && '@/plugins',
        folderExists('public') && '@/public',
      ].filter(Boolean),
      unsortedAliasses,
      [
        folderExists('constants') && '@/constants',
        folderExists('functions') && '@/functions',
        folderExists('utils') && '@/utils',
        folderExists('hooks') && '@/hooks',
      ].filter(Boolean),
      [
        folderExists('layouts') && '@/layouts',
        folderExists('pages') && '@/pages',
      ].filter(Boolean),
      [
        folderExists('components') && '@/components',
      ].filter(Boolean),
    ].filter(el => (el?.length || 0) > 0),
  }
}
