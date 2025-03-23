import {defineConfig, UserConfig} from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

const root = (filePath: string) => path.resolve(import.meta.dirname, filePath)

export default defineConfig({
  base: './',
  plugins: [dts({rollupTypes: true})],
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
      fileName: format => `index.${format === 'cjs' ? 'cjs' : `${format}.js`}`,
    },
    rollupOptions: {
      external: ['node:fs', 'node:path'],
      output: {
        globals: {
          'node:fs': 'fs',
          'node:path': 'path',
        },
      },
    },
  },
} satisfies UserConfig)
