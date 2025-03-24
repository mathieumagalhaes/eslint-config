# Sorting examples by group
Reference: https://perfectionist.dev/rules/sort-imports.html#groups

```javascript

// side-effect-style - Side effect style imports
import './styles.scss'
// 'side-effect' - Side effect imports
import './set-production-env.js'

// 'external-type' - TypeScript type imports
import type { AxiosError } from 'axios'
// 'builtin-type' - TypeScript type imports from Built-in Modules
import type { Server } from 'http'
// 'internal-type' - TypeScript type imports from your internal modules
import type { User } from '@/users'
// 'parent-type' - TypeScript type imports from parent directory
import type { InputProps } from '../Input'
// 'sibling-type' - TypeScript type imports from the same directory
import type { Details } from './data'
// 'index-type' - TypeScript type imports from main directory file
import type { BaseOptions } from './index.d.ts'


// 'builtin' - Node.js Built-in Modules
import path from 'path'
// 'external' - External modules installed in the project
import axios from 'axios'

// 'parent' - Modules from parent directory
import formatNumber from '../utils/format-number'
// 'sibling' - Modules from the same directory
import config from './config'
// 'index' - Main file from the current directory
import main from '.'
// 'style' - Styles
import styles from './index.module.css'

// 'internal' - Your internal modules
import Button from '@/components/Button'

// 'object' - TypeScript object-imports
import log = console.log
```
