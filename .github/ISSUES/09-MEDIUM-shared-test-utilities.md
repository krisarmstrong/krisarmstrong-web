---
title: '🟡 MEDIUM: Create shared test utilities and standardize test setup'
labels: testing, medium-priority, refactor, dx
assignees: krisarmstrong
---

**Status: CLOSED (2025-11-24) — Shared test utilities live in `packages/web-foundation/src/test-utils`, referenced by apps; Vitest base config supports shared setup.**

## Priority: MEDIUM 🟡

**Impact:** ~130 lines of duplicated test setup, inconsistent test patterns

## Current State

Test setup files duplicated across apps:

- `apps/intrinsic/src/__tests__/setup.ts` (56 lines)
- `apps/krisarmstrong/tests/setup.ts` (39 lines)
- `apps/wifivigilante/src/tests/setup.ts` (37 lines)

### Duplicated Setup Code

- localStorage mock (95% identical)
- window.matchMedia mock (95% identical)
- IntersectionObserver mock (intrinsic only)
- Cleanup teardown (similar)

### Inconsistent Test Locations

- Intrinsic: `src/__tests__/`
- KrisArmstrong: `tests/`
- WiFiVigilante: `src/tests/`

## Solution

Create shared test utilities in web-foundation and standardize locations.

## Implementation

### Step 1: Create shared test utilities

Create `packages/web-foundation/src/test-utils/index.ts`:

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Theme-aware render
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: any;
  themeMode?: 'light' | 'dark' | 'auto';
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const {
    theme,
    themeMode = 'light',
    route = '/',
    ...renderOptions
  } = options || {};

  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <ThemeProvider initialTheme={theme} initialMode={themeMode}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Common mocks
export function createLocalStorageMock() {
  let store: Record<string, string> = {};

  const mockLocalStorage = {
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
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };

  return mockLocalStorage;
}

export function createMatchMediaMock(matches = false) {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

export function createIntersectionObserverMock() {
  class MockIntersectionObserver {
    constructor(
      public callback: IntersectionObserverCallback,
      public options?: IntersectionObserverInit
    ) {}

    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }

  return MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

// Setup helpers
export function setupDomMocks() {
  // localStorage
  Object.defineProperty(window, 'localStorage', {
    value: createLocalStorageMock(),
    writable: true,
  });

  // matchMedia
  Object.defineProperty(window, 'matchMedia', {
    value: createMatchMediaMock(false),
    writable: true,
  });

  // IntersectionObserver
  global.IntersectionObserver = createIntersectionObserverMock();
}

export function cleanupDomMocks() {
  if (window.localStorage) {
    window.localStorage.clear();
  }
}

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi, expect, describe, it, test, beforeEach, afterEach } from 'vitest';
```

### Step 2: Export from web-foundation

Update `packages/web-foundation/src/index.ts`:

```typescript
// ... existing exports

// Test utilities (only in dev)
export * from './test-utils';
```

Update `packages/web-foundation/package.json`:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./test-utils": {
      "types": "./dist/test-utils/index.d.ts",
      "import": "./dist/test-utils/index.js",
      "require": "./dist/test-utils/index.cjs"
    }
  }
}
```

### Step 3: Standardize test directory structure

**New standard:** All apps use `src/__tests__/`

```bash
# KrisArmstrong - Move tests
cd apps/krisarmstrong
mv tests src/__tests__

# WiFiVigilante - Rename
cd apps/wifivigilante
mv src/tests src/__tests__
```

Update `tsconfig.json` in all apps:

```json
{
  "include": ["src"],
  "exclude": ["node_modules", "dist", "build", "src/__tests__"]
}
```

### Step 4: Update app setup files

**All apps (`src/__tests__/setup.ts`):**

```typescript
import { setupDomMocks, cleanupDomMocks } from '@krisarmstrong/web-foundation/test-utils';
import { afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom';

// Setup DOM mocks once before all tests
beforeAll(() => {
  setupDomMocks();
});

// Clean up after each test
afterEach(() => {
  cleanupDomMocks();
});
```

That's it! Reduced from 50+ lines to ~10 lines.

### Step 5: Update test files to use utilities

**Before:**

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('renders', () => {
    render(<Component />);
    // ...
  });
});
```

**After:**

```typescript
import { renderWithProviders, screen, describe, it, expect } from '@krisarmstrong/web-foundation/test-utils';

describe('Component', () => {
  it('renders with theme', () => {
    renderWithProviders(<Component />, { themeMode: 'dark' });
    // ...
  });
});
```

### Step 6: Update vitest configs

All apps:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    // ...
  },
});
```

### Step 7: Update package.json test scripts

Standardize across all apps:

```json
{
  "scripts": {
    "test": "vitest --pool=threads",
    "test:ui": "vitest --ui --pool=threads",
    "test:coverage": "vitest --coverage --pool=threads",
    "test:watch": "vitest --watch --pool=threads"
  }
}
```

## Testing Checklist

- [ ] Shared test utilities created
- [ ] Exported from web-foundation
- [ ] Test directories standardized to `src/__tests__/`
- [ ] All app setup files use shared utilities
- [ ] All tests updated to use new utilities
- [ ] All tests pass
- [ ] Coverage still works

## Files to Modify

### Create

- `packages/web-foundation/src/test-utils/index.ts`

### Update

- `packages/web-foundation/src/index.ts` (export test utils)
- `packages/web-foundation/package.json` (export test-utils path)
- `apps/intrinsic/src/__tests__/setup.ts` (use shared utils)
- `apps/krisarmstrong/src/__tests__/setup.ts` (use shared utils)
- `apps/wifivigilante/src/__tests__/setup.ts` (use shared utils)
- All test files (import from shared utils)
- All `package.json` (standardize test scripts)

### Move/Rename

- `apps/krisarmstrong/tests/` → `apps/krisarmstrong/src/__tests__/`
- `apps/wifivigilante/src/tests/` → `apps/wifivigilante/src/__tests__/`

## Success Criteria

- [ ] ~130 lines of duplicated setup removed
- [ ] All apps use shared test utilities
- [ ] Consistent test directory structure
- [ ] Easier to write tests with helpers
- [ ] Better developer experience

## Benefits

- **Code reduction:** 130+ lines → ~30 lines + shared module
- **Consistency:** Same test patterns across apps
- **DX:** Easier to write tests with helpers
- **Maintainability:** Update mocks in one place
- **Onboarding:** Clear testing patterns for new developers
