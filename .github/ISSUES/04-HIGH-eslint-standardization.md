---
title: "🟠 HIGH: Create shared ESLint base config for all apps"
labels: eslint, high-priority, refactor, tooling
assignees: krisarmstrong
---

## Priority: HIGH 🟠

**Impact:** Inconsistent linting rules across apps, maintenance burden

## Current State

Each app has its own ESLint config with different rules and plugins:

| App | Config | Plugins | Type Check | Security |
|-----|--------|---------|------------|----------|
| Intrinsic | Minimal | 4 | ❌ | ❌ |
| KrisArmstrong | Comprehensive | 8 | ✅ | ✅ |
| WiFiVigilante | Comprehensive | 8 | ❌ | ✅ |

## Problems
1. Configuration drift between apps
2. Maintenance burden (3 copies)
3. New apps require copying config
4. Inconsistent developer experience

## Solution

Create shared base configuration that all apps extend.

## Implementation

### Step 1: Create base config
Create `.eslint.config.base.js` in root:

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import noSecrets from 'eslint-plugin-no-secrets';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.recommended,
      security.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      react.configs.flat.recommended,
    ],
    plugins: {
      'react-refresh': reactRefresh,
      'no-secrets': noSecrets,
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Security
      'no-secrets/no-secrets': 'error',

      // Best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
```

### Step 2: Update app configs

#### Intrinsic (`apps/intrinsic/eslint.config.js`)
```javascript
import baseConfig from '../../eslint.config.base.js';

export default [
  ...baseConfig,
  {
    // App-specific overrides
  },
];
```

#### KrisArmstrong (`apps/krisarmstrong/eslint.config.js`)
```javascript
import baseConfig from '../../eslint.config.base.js';

export default [
  ...baseConfig,
  {
    // App-specific overrides
  },
];
```

#### WiFiVigilante (`apps/wifivigilante/eslint.config.js`)
```javascript
import baseConfig from '../../eslint.config.base.js';

export default [
  ...baseConfig,
  {
    // App-specific overrides
  },
];
```

### Step 3: Update all package.json lint scripts

All apps should have:
```json
{
  "scripts": {
    "lint": "eslint . && tsc --noEmit",
    "lint:fix": "eslint . --fix"
  }
}
```

### Step 4: Install shared dependencies at root

```bash
npm install -D \
  @eslint/js \
  eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-security \
  eslint-plugin-jsx-a11y \
  eslint-plugin-no-secrets \
  typescript-eslint \
  globals
```

### Step 5: Test all apps

```bash
npm run lint --workspaces
```

## Testing Checklist
- [ ] Base config created
- [ ] All apps extend base config
- [ ] All apps include TypeScript checking in lint
- [ ] Security plugins active in all apps
- [ ] Accessibility checks in all apps
- [ ] CI pipeline passes for all apps
- [ ] Pre-commit hooks work

## Files to Modify
- **Create:** `eslint.config.base.js`
- **Update:** `apps/intrinsic/eslint.config.js`
- **Update:** `apps/krisarmstrong/eslint.config.js`
- **Update:** `apps/wifivigilante/eslint.config.js`
- **Update:** All `package.json` lint scripts

## Success Criteria
- [ ] Single source of truth for linting rules
- [ ] All apps have same security/accessibility checks
- [ ] Consistent developer experience
- [ ] Easy to add new apps

## Benefits
- ~60 lines reduced (3 configs → 1 base + 3 minimal)
- Consistent rules enforcement
- Easier maintenance
- Better security coverage
