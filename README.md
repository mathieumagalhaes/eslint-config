# @mathieumagalhaes/eslint-config

Personal (Mathieu Magalhaes) ESLint configuration.
Made to be used with [@antfu/eslint-config](https://github.com/antfu/eslint-config).

## Usage
Remove anything eslint related, including plugins etc.<br>
Then install:

### pnpm
```bash
pnpm install -D @mathieumagalhaes/eslint-config @antfu/eslint-config eslint jiti
```

### yarn
```bash
yarn install -D @mathieumagalhaes/eslint-config @antfu/eslint-config eslint jiti
```

### npm
```bash
npm install -D @mathieumagalhaes/eslint-config @antfu/eslint-config eslint jiti
```

## Minimal setup
```js
// eslint.config.ts or eslint.config.mjs
import { resolve } from 'node:path'
import antfu from '@antfu/eslint-config'
import mathieumagalhaes from '@mathieumagalhaes/eslint-config'

export default antfu(mathieumagalhaes({
  type: 'app',
  typescript: true,

  srcFolder: resolve(import.meta.dirname, './src'), // default: ./src
  preferAtPrefixImportsRules: true, // default: false
}))
```

## Full setup:
```js
// eslint.config.ts or eslint.config.mjs
import { resolve } from 'node:path'
import antfu from '@antfu/eslint-config'
import mathieumagalhaes from '@mathieumagalhaes/eslint-config'

export default antfu(mathieumagalhaes({
  // Check out @antfu/eslint-config for other options!
  type: 'app',
  vue: true,
  typescript: true,

  ignore: [],

  // If true, skips setting default sensable paths/files to ignore for eslint.
  // This gives you full control over files that are being ignored.
  doNotSetDefaultIgnores: false, // default: false

  srcFolder: resolve(import.meta.dirname, './src'), // default: ./src
  preferAtPrefixImportsRules: true, // default: false

  aliasesTypesRelated: [], // default: []       --  Used in perfectionist/sort-imports preference
  aliasesAppRelated: [], // default: []         --  Used in perfectionist/sort-imports preference
  aliasesLayoutRelated: [], // default: []      --  Used in perfectionist/sort-imports preference
  aliasesComponentsRelated: [], // default: []  --  Used in perfectionist/sort-imports preference
  aliasesConstantsRelated: [], // default: []   --  Used in perfectionist/sort-imports preference
  aliasesFunctionsRelated: [], // default: []   --  Used in perfectionist/sort-imports preference

  rules: {
    // You can disable/overwrite any rule.
    // Example for disabling my preference around perfectionist/sort-imports.
    'perfectionist/sort-imports': 'off',
  }
}))
```
___

Modify as needed ofcourse.<br>

Custom configuration options of this library are:
- doNotSetDefaultIgnores
- srcFolder
- preferAtPrefixImportsRules
- aliasesTypesRelated
- aliasesAppRelated
- aliasesLayoutRelated
- aliasesComponentsRelated
- aliasesConstantsRelated
- aliasesFunctionsRelated

<br>

Please check out [@antfu/eslint-config](https://github.com/antfu/eslint-config) for the list of all other passable configuration options.
