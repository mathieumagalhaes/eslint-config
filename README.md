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

Add to your `eslint.config.ts` or `eslint.config.mjs`:

```js
import { resolve } from 'node:path'
import antfu from '@antfu/eslint-config'
import mathieumagalhaes from '@mathieumagalhaes/eslint-config'

export default antfu(mathieumagalhaes({
  type: 'app',
  vue: true,
  typescript: true,

  srcFolder: resolve(import.meta.dirname, './src'), // default: ./src
  preferAtPrefixImportsRules: true, // default: false
}))
```
___

You can modify as needed ofcourse.<br>
Enable / Disable typescript and vue if needed.
