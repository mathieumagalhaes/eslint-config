import {defineConfig, UserConfig} from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const root = (filePath: string) => resolve(import.meta.dirname, filePath)

export default defineConfig({
  base: './',
  plugins: [dts()],
  resolve: {
    alias: {
      '@': root('src'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: root('src/index.ts'),
      name: 'lib',
      formats: ['es', 'cjs'],                       // For libraries
      // formats: ['es', 'cjs', 'umd', 'iife'],     // For browser use
      fileName: (format, entryName) => {
        const fileName = entryName.split('/').pop()
        return `${fileName}.${format === 'cjs' ? 'cjs' : `${format}.js`}`
      }
    },
    rollupOptions: {
      external: [
        '@antfu/eslint-config',
        'eslint',
        /^node:(.+)$/,
        'path',
        'fs',
        'crypto',
        'stream',
        'util',
        'assert',
        'os',
        'url',
        'events',
        'module',
        'constants',
        'worker_threads',
        'child_process',
        'readline',
        'tty',
        'v8',
        'perf_hooks',
        'vm'
      ],
      output: {
        globals: {
          '@antfu/eslint-config': 'antfu',
          'eslint': 'eslint',
          'fs': 'fs',
          'path': 'path',
          'node:fs': 'fs',
          'node:path': 'path',
        },
      }
    },
  },
} satisfies UserConfig)
