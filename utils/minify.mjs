import { readdir, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { minify } from 'terser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const distDir = join(__dirname, '../dist')

readdir(distDir, { recursive: true }, async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }

  try {
    for (const file of files) {
      if (!file.endsWith('.js')) continue
      const filePath = join(distDir, file)
      const fileName = file.split('/').pop()

      const code = readFileSync(filePath, 'utf8')
      const result = await minify(code, {
        compress: true,
        mangle: true,
        format: {
          comments: false,
        },
        sourceMap: {
          filename: fileName,
          url: `${fileName}.map`,
        },
      })

      writeFileSync(filePath, result.code)
      writeFileSync(`${filePath}.map`, result.map)
    }
    // eslint-disable-next-line no-console
    console.log('Build completed successfully')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
})
