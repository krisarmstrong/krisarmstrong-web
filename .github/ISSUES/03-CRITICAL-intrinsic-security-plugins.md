---
title: "🔴 CRITICAL: Add security plugins to Intrinsic ESLint config"
labels: security, critical, eslint, intrinsic
assignees: krisarmstrong
---

## Priority: CRITICAL 🔴

**Impact:** Intrinsic app lacks security linting that other apps have

## Current State

**Intrinsic ESLint config is incomplete:**
- File: `apps/intrinsic/eslint.config.js` (lines 1-23)
- Only 4 basic plugins
- **Missing critical security checks**

**Other apps have comprehensive security:**
- KrisArmstrong: 8 plugins including security
- WiFiVigilante: 8 plugins including security

## Missing Security Plugins

### 1. eslint-plugin-security
Detects security anti-patterns:
- SQL injection vulnerabilities
- Regex DoS
- Unsafe regex
- Eval usage
- Insecure random number generation

### 2. eslint-plugin-no-secrets
Prevents accidental secret commits:
- API keys
- Passwords
- Tokens
- Private keys

### 3. eslint-plugin-jsx-a11y
Accessibility checks:
- ARIA attributes
- Alt text for images
- Keyboard navigation
- Screen reader support

## Implementation

### Step 1: Install dependencies
```bash
cd apps/intrinsic
npm install -D eslint-plugin-security eslint-plugin-jsx-a11y eslint-plugin-no-secrets
```

### Step 2: Update eslint.config.js

Replace current config with:
```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import noSecrets from 'eslint-plugin-no-secrets';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.recommended,
      security.configs.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      'react-refresh': reactRefresh,
      'no-secrets': noSecrets,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-secrets/no-secrets': 'error',
    },
  },
];
```

### Step 3: Update lint script
Update `apps/intrinsic/package.json`:
```json
"lint": "eslint . && tsc --noEmit",
"lint:fix": "eslint . --fix"
```

### Step 4: Fix any new errors
```bash
npm run lint:fix
npm run lint
```

## Testing Checklist
- [ ] Dependencies installed
- [ ] ESLint config updated
- [ ] Lint script includes type checking
- [ ] All security rules active
- [ ] No secrets detected in codebase
- [ ] Accessibility checks pass
- [ ] CI pipeline passes
- [ ] Pre-commit hooks work

## Files to Modify
- `apps/intrinsic/eslint.config.js`
- `apps/intrinsic/package.json` (lint scripts)

## Success Criteria
- [ ] Intrinsic has same security plugins as other apps
- [ ] Security linting runs in CI
- [ ] Pre-commit hooks catch security issues
- [ ] Accessibility issues caught before commit

## References
- KrisArmstrong config: `apps/krisarmstrong/eslint.config.js`
- WiFiVigilante config: `apps/wifivigilante/eslint.config.js`
- Security policy: `SECURITY.md`
