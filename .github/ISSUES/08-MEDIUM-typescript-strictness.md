---
title: "🟡 MEDIUM: Standardize TypeScript strictness across all apps"
labels: typescript, medium-priority, refactor, quality
assignees: krisarmstrong
---

## Priority: MEDIUM 🟡

**Impact:** Inconsistent type safety across apps, potential bugs not caught

## Current State

TypeScript strictness varies significantly:

| App | Strict Options | Return Types | Path Aliases |
|-----|---------------|--------------|--------------|
| **Intrinsic** | Basic | `JSX.Element` | ❌ |
| **KrisArmstrong** | Enhanced | Omitted | ✅ |
| **WiFiVigilante** | Basic | `React.ReactElement` | ❌ |

### KrisArmstrong's Enhanced Strictness

`apps/krisarmstrong/tsconfig.json:31-42`:
```json
{
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "allowUnreachableCode": false,
  "allowUnusedLabels": false
}
```

**Other apps are missing these important checks.**

## Problems
1. Different type safety levels across apps
2. Bugs caught in one app but not others
3. Inconsistent developer experience
4. Return type annotations vary (JSX.Element vs React.ReactElement vs none)

## Solution

Adopt KrisArmstrong's stricter configuration as the standard.

## Implementation

### Step 1: Update tsconfig.base.json

After creating shared base config (see issue #06), ensure it includes:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    // Module resolution
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    // Strict type checking
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,

    // Module interop
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Step 2: Standardize return type annotations

Choose **one** convention and apply everywhere:

**Recommended:** Use TypeScript inference (no explicit return type)

```typescript
// ❌ Before - Inconsistent
function ComponentA(): JSX.Element { ... }
function ComponentB(): React.ReactElement { ... }
function ComponentC() { ... }

// ✅ After - Consistent (rely on inference)
export function ComponentA() {
  return <div>...</div>;
}

export function ComponentB() {
  return <div>...</div>;
}
```

**Alternative:** Explicit `React.FC` typing

```typescript
import { FC } from 'react';

export const Component: FC = () => {
  return <div>...</div>;
};
```

### Step 3: Fix new TypeScript errors

After enabling strict options, fix errors:

```bash
cd apps/intrinsic
npm run lint
# Fix errors

cd ../wifivigilante
npm run lint
# Fix errors
```

Common fixes needed:
- Remove unused variables
- Remove unused function parameters (prefix with `_` if intentionally unused)
- Add return statements to all code paths
- Remove unreachable code

### Step 4: Add path aliases to all apps

Update all app `tsconfig.json` files:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "build"]
}
```

Then update imports:

```typescript
// ❌ Before
import { Component } from '../../../components/Component';

// ✅ After
import { Component } from '@/components/Component';
```

### Step 5: Update vite configs for path aliases

All `vite.config.ts` files need:

```typescript
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Testing Checklist
- [ ] Enhanced strict options in base tsconfig
- [ ] All apps pass type checking
- [ ] Return type annotations standardized
- [ ] Path aliases work in all apps
- [ ] All imports updated to use aliases
- [ ] No unused variables/parameters
- [ ] CI passes for all apps

## Files to Modify

### Update
- `tsconfig.base.json` (add strict options)
- `apps/intrinsic/tsconfig.json` (add path aliases)
- `apps/krisarmstrong/tsconfig.json` (already has it)
- `apps/wifivigilante/tsconfig.json` (add path aliases)
- All component files (standardize return types)
- Various files (fix new strict errors)

## Success Criteria
- [ ] All apps use same TypeScript strictness
- [ ] All apps use path aliases
- [ ] Return type annotations consistent
- [ ] No TypeScript errors in any app
- [ ] Better type safety across monorepo

## Benefits
- **Type safety:** Catch more bugs at compile time
- **Consistency:** Same rules everywhere
- **Developer experience:** Better IDE support with path aliases
- **Code quality:** Enforced best practices
- **Maintainability:** Cleaner imports
