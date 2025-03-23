# @mathieumagalhaes/eslint-config

Personal (Mathieu Magalhaes) ESLint configuration.
Made to be used with [@antfu/eslint-config](https://github.com/antfu/eslint-config).

## Usage

### pnpm
```bash
pnpm install -D @mathieumagalhaes/eslint-config @antfu/eslint-config
```

### yarn
```bash
yarn install -D @mathieumagalhaes/eslint-config @antfu/eslint-config
```

### npm
```bash
npm install -D @mathieumagalhaes/eslint-config @antfu/eslint-config
```

Add to your `esline.config.ts` or `esline.config.mjs`:

```js
import antfu from '@antfu/eslint-config'
import mathieumagalhaes from '@mathieumagalhaes/eslint-config'
import { resolve } from 'node:path'

export default antfu({
  type: 'app',
  vue: true,
  typescript: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  ignores: [
    'node_modules/**',
    'dist/**',
    'build/**',
    'public/meta/*.json',
    'package.json',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'bun.lockb',
    'tsconfig*.json',
    '.gitlab-ci.yml',
    '.gitlab-ci.yaml',
    'vite.config.ts',
    'nuxt.config.ts',
  ],

  rules: {
    ...mathieumagalhaes({
      vue: true,
      typescript: true,
      srcFolder: resolve(import.meta.dirname, './src')
    }),
  },
})
```
___

You can modify as needed ofcourse.<br>
Enable / Disable typescript and vue if needed.
