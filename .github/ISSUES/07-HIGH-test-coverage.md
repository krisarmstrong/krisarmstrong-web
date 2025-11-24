---
title: '🟠 HIGH: Improve test coverage and add coverage thresholds to CI'
labels: testing, high-priority, quality, ci
assignees: krisarmstrong
---

**Status: CLOSED (2025-11-24) — CI now runs `npm run test:coverage --workspaces` with Vitest thresholds (80% lines/branches/functions/statements) and uploads coverage from all workspace reports.**

## Priority: HIGH 🟠

**Impact:** Unknown test coverage, no quality gates preventing regressions

## Current State

- **Total test files:** 35 (19 in apps, 16 in web-foundation)
- **Coverage reports:** None visible
- **Coverage thresholds:** None enforced
- **CI coverage checks:** None

### Test Distribution

| Package        | Test Files | Coverage Command | Thresholds |
| -------------- | ---------- | ---------------- | ---------- |
| Intrinsic      | ~5         | ✅               | ❌         |
| KrisArmstrong  | ~7         | ✅               | ❌         |
| WiFiVigilante  | ~7         | ✅               | ❌         |
| web-foundation | 16         | ✅               | ❌         |

## Problems

1. Unknown coverage percentage
2. No minimum coverage enforcement
3. PRs can merge without tests
4. Quality can decrease over time
5. Critical paths may be untested

## Goal

Achieve and maintain **>80% test coverage** per CONTRIBUTING.md

## Implementation

### Step 1: Measure current coverage

Run coverage for each package:

```bash
# Intrinsic
cd apps/intrinsic
npm run test:coverage

# KrisArmstrong
cd apps/krisarmstrong
npm run test:coverage

# WiFiVigilante
cd apps/wifivigilante
npm run test:coverage

# web-foundation
cd packages/web-foundation
npm run test:coverage
```

Document baseline coverage numbers.

### Step 2: Add coverage thresholds to vitest configs

Update each `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    // ... existing config
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/tests/**',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      // Add thresholds
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### Step 3: Update CI workflow

Update `.github/workflows/ci.yml`:

```yaml
jobs:
  test:
    name: Test & Coverage
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage --workspaces --if-present

      - name: Check coverage thresholds
        run: |
          echo "Checking coverage thresholds..."
          # Vitest will fail if thresholds not met

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: |
            ./apps/intrinsic/coverage/coverage-final.json
            ./apps/krisarmstrong/coverage/coverage-final.json
            ./apps/wifivigilante/coverage/coverage-final.json
            ./packages/web-foundation/coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: true
```

### Step 4: Add coverage scripts to root package.json

```json
{
  "scripts": {
    "test:coverage": "npm run test:coverage --workspaces --if-present",
    "coverage:report": "open apps/intrinsic/coverage/index.html"
  }
}
```

### Step 5: Create shared test utilities

Create `packages/web-foundation/src/test-utils/index.ts`:

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from '../context/ThemeContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: any;
  themeMode?: 'light' | 'dark' | 'auto';
}

export function renderWithTheme(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { theme, themeMode = 'light', ...renderOptions } = options || {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider initialTheme={theme} initialMode={themeMode}>
        {children}
      </ThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Common test mocks
export const mockLocalStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

export const mockMatchMedia = (matches = false) => {
  return {
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

### Step 6: Write missing tests

Focus on critical paths:

**Priority 1 (Critical):**

- [ ] All page components
- [ ] Form validation and submission
- [ ] Authentication flows (if any)
- [ ] API calls and error handling
- [ ] Theme switching logic

**Priority 2 (Important):**

- [ ] All shared UI components
- [ ] Routing logic
- [ ] Error boundaries
- [ ] Loading states
- [ ] Navigation components

**Priority 3 (Nice to have):**

- [ ] Utility functions
- [ ] Hooks
- [ ] Constants/config
- [ ] Edge cases

### Step 7: Add E2E tests with Playwright

Create `e2e/` directory in each app:

```typescript
// apps/intrinsic/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display main content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Services');
    await expect(page).toHaveURL('/services');
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('[aria-label*="theme"]');
    await themeToggle.click();
    // Assert dark mode applied
  });
});
```

## Testing Checklist

### Setup

- [ ] Measure baseline coverage for all packages
- [ ] Add coverage thresholds to configs
- [ ] Update CI to enforce coverage
- [ ] Create shared test utilities
- [ ] Export test utilities from web-foundation

### Coverage Targets

- [ ] web-foundation: >80% coverage
- [ ] Intrinsic: >80% coverage
- [ ] KrisArmstrong: >80% coverage
- [ ] WiFiVigilante: >80% coverage

### Test Types

- [ ] Unit tests for all components
- [ ] Integration tests for user flows
- [ ] E2E tests with Playwright
- [ ] Accessibility tests
- [ ] Visual regression tests (optional)

### CI/CD

- [ ] Coverage reports generated in CI
- [ ] Codecov integration working
- [ ] PRs blocked if coverage drops
- [ ] Coverage badge in README

## Files to Modify

### Update

- `apps/intrinsic/vitest.config.ts` (add thresholds)
- `apps/krisarmstrong/vitest.config.ts` (add thresholds)
- `apps/wifivigilante/vitest.config.ts` (add thresholds)
- `packages/web-foundation/vitest.config.ts` (add thresholds)
- `.github/workflows/ci.yml` (coverage enforcement)
- `package.json` (coverage scripts)

### Create

- `packages/web-foundation/src/test-utils/index.ts`
- `apps/intrinsic/e2e/` (E2E tests)
- `apps/krisarmstrong/e2e/` (E2E tests)
- `apps/wifivigilante/e2e/` (E2E tests)

### Add Tests

- Multiple new test files across all packages

## Success Criteria

- [ ] All packages >80% coverage
- [ ] CI fails if coverage drops below threshold
- [ ] Coverage reports visible in PRs
- [ ] E2E tests cover critical user journeys
- [ ] Shared test utilities reduce duplication
- [ ] Developer documentation for testing

## Benefits

- **Quality assurance:** Catch bugs before production
- **Confidence:** Safe to refactor with test safety net
- **Documentation:** Tests serve as usage examples
- **Regression prevention:** Automated quality gates
- **Onboarding:** New developers understand code through tests
