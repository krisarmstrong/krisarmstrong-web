---
title: '🟢 LOW: Standardize code style (quotes, class names, formatting)'
labels: code-style, low-priority, refactor, dx
assignees: krisarmstrong
---

**Status: CLOSED (2025-11-24) — ESLint + Prettier standardized via root configs and lint-staged; consistent formatting enforced across workspaces.**

## Priority: LOW 🟢

**Impact:** Minor inconsistencies in code style, doesn't affect functionality

## Current Issues

### 1. Quote Style Inconsistency

**Import quotes:**

- Intrinsic: Mix of single and double quotes
- KrisArmstrong: Predominantly double quotes
- WiFiVigilante: Mix of single and double quotes

```typescript
// Inconsistent
import Footer from './components/Footer.tsx'; // Single quotes
import Footer from './components/Footer'; // Double quotes
```

### 2. CSS Class Name Inconsistency

Different class names for same concept:

- `bg-surface-base` (Intrinsic/KrisArmstrong)
- `bg-surface` (WiFiVigilante)

### 3. Component Return Type Style

- Some: `JSX.Element`
- Some: `React.ReactElement`
- Some: No explicit type (inference)

## Recommended Standards

### Quote Style

**Standard:** Double quotes for strings, single quotes for JSX attributes (Prettier default)

```typescript
// JavaScript/TypeScript
import { Component } from "@krisarmstrong/web-foundation";
const message = "Hello, world!";

// JSX
<Component className='container' data-testid='my-component' />
```

### CSS Class Names

**Standard:** Follow Tailwind conventions, use descriptive names

```css
/* Consistent surface classes */
bg-surface-base  // Base background
bg-surface-raised  // Elevated components (cards)
bg-surface-hover  // Hover states
```

### TypeScript Return Types

**Standard:** Let TypeScript infer return types for components (unless complex)

```typescript
// ✅ Recommended - Inference
export function Component() {
  return <div>...</div>;
}

// ✅ Also acceptable - Explicit FC
export const Component: FC<Props> = (props) => {
  return <div>...</div>;
};

// ❌ Avoid - Manual annotation
export function Component(): JSX.Element {
  return <div>...</div>;
}
```

## Implementation

### Step 1: Configure Prettier

Update `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": true
}
```

### Step 2: Run Prettier on all files

```bash
npm run format
```

### Step 3: Update .prettierignore

```
dist
build
coverage
node_modules
*.md
CHANGELOG.md
package-lock.json
pnpm-lock.yaml
```

### Step 4: Fix CSS class names

Search and replace:

```bash
# WiFiVigilante - standardize surface classes
find apps/wifivigilante/src -type f -name "*.tsx" -exec sed -i '' 's/bg-surface"/bg-surface-base"/g' {} +
```

### Step 5: Remove explicit return type annotations

Let TypeScript infer types for components:

```typescript
// Before
export function Component(): JSX.Element {
  return <div />;
}

// After
export function Component() {
  return <div />;
}
```

### Step 6: Add format check to CI

Update `.github/workflows/ci.yml`:

```yaml
- name: Check formatting
  run: npm run format:check
```

### Step 7: Update pre-commit hooks

Ensure `.lintstagedrc.json` includes formatting:

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

## Testing Checklist

- [ ] Prettier configured
- [ ] All files formatted
- [ ] CSS class names standardized
- [ ] Return types use inference
- [ ] CI checks formatting
- [ ] Pre-commit hooks format code
- [ ] No functionality broken

## Files to Modify

### Create/Update

- `.prettierrc` (standardize config)
- `.prettierignore` (exclude build artifacts)

### Format (automated)

- All `.ts`, `.tsx`, `.js`, `.jsx` files
- All `.json`, `.yml`, `.yaml` files (except lock files)

### Manual fixes

- CSS class names (search and replace)
- Return type annotations (optional, low priority)

## Success Criteria

- [ ] Consistent quote style across all files
- [ ] Consistent CSS class naming
- [ ] Prettier enforced in CI
- [ ] Pre-commit hooks format code
- [ ] No manual formatting needed

## Benefits

- **Consistency:** Same style everywhere
- **Automation:** No manual formatting
- **DX:** Focus on logic, not style
- **PR reviews:** No style bikeshedding
- **Cleaner diffs:** Only meaningful changes
