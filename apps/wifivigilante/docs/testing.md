# Testing Guide

Comprehensive testing documentation for Wi-Fi Vigilante.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
  - [Unit Tests](#unit-tests)
  - [Component Tests](#component-tests)
  - [Integration Tests](#integration-tests)
- [Testing Patterns](#testing-patterns)
- [Mocking](#mocking)
- [Coverage](#coverage)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

Wi-Fi Vigilante uses **Vitest** as the testing framework and **React Testing Library** for component testing. The testing strategy focuses on:

- **Unit tests** for utility functions and business logic
- **Component tests** for UI components and user interactions
- **Integration tests** for API interactions and state management
- **Accessibility tests** for WCAG 2.1 compliance

**Current Status:**
- Test files: 41
- Target coverage: 80%+
- Test framework: Vitest 3.x
- Component testing: React Testing Library

## Testing Stack

| Tool | Purpose | Version |
|------|---------|---------|
| **Vitest** | Test runner and framework | 3.x |
| **React Testing Library** | Component testing | Latest |
| **@testing-library/user-event** | User interaction simulation | Latest |
| **@testing-library/jest-dom** | DOM matchers | Latest |
| **happy-dom** | DOM environment for tests | Latest |
| **@vitest/ui** | Visual test UI | 3.x |

## Getting Started

### Installation

All testing dependencies are already installed with the project:

```bash
npm install
```

### Configuration

Test configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/dist/**',
      ],
    },
  },
});
```

### Test Setup

Global test setup is in `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Running Tests

### All Tests

Run all tests once:

```bash
npm test
```

### Watch Mode

Run tests in watch mode (recommended for development):

```bash
npm test -- --watch
```

### Visual UI

Run tests with the Vitest UI:

```bash
npm run test:ui
```

This opens a browser interface at `http://localhost:51204/__vitest__/`

### Coverage Report

Generate test coverage report:

```bash
npm run test:coverage
```

This creates a coverage report in `coverage/` directory and displays summary in terminal.

### Specific Tests

Run specific test file:

```bash
npm test src/utils/validation.test.ts
```

Run tests matching pattern:

```bash
npm test -- --grep="CaseCard"
```

Run tests in specific directory:

```bash
npm test src/components/
```

### Debug Mode

Run tests with debugging enabled:

```bash
npm test -- --inspect-brk
```

## Writing Tests

### Unit Tests

Unit tests focus on individual functions and utilities.

**Example: Testing Validation Utility**

```typescript
// src/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateCase } from './validation';

describe('validateCase', () => {
  it('should return no errors for valid case data', () => {
    const validCase = {
      title: 'Test Case',
      sector: 'Healthcare',
      incident_overview: 'Test overview',
      tools_used: ['Wireshark'],
      severity: 'medium',
    };

    const errors = validateCase(validCase);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should require title', () => {
    const invalidCase = {
      title: '',
      sector: 'Healthcare',
      incident_overview: 'Test overview',
    };

    const errors = validateCase(invalidCase);
    expect(errors.title).toBe('Case title is required');
  });

  it('should validate title length', () => {
    const invalidCase = {
      title: 'A'.repeat(201),
      sector: 'Healthcare',
      incident_overview: 'Test overview',
    };

    const errors = validateCase(invalidCase);
    expect(errors.title).toContain('too long');
  });

  it('should validate sector is in allowed list', () => {
    const invalidCase = {
      title: 'Test Case',
      sector: 'InvalidSector',
      incident_overview: 'Test overview',
    };

    const errors = validateCase(invalidCase);
    expect(errors.sector).toBe('Invalid sector selected');
  });
});
```

**Example: Testing Cache Utility**

```typescript
// src/utils/cache.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CacheManager from './cache';

describe('CacheManager', () => {
  let cache: CacheManager<string>;

  beforeEach(() => {
    cache = new CacheManager<string>(1000); // 1 second TTL
  });

  it('should store and retrieve data', () => {
    cache.set('key1', 'value1');
    const result = cache.get('key1');

    expect(result).not.toBeNull();
    expect(result?.data).toBe('value1');
    expect(result?.isStale).toBe(false);
  });

  it('should return null for non-existent keys', () => {
    const result = cache.get('nonexistent');
    expect(result).toBeNull();
  });

  it('should mark data as stale after TTL', async () => {
    cache.set('key1', 'value1');

    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 1100));

    const result = cache.get('key1');
    expect(result?.isStale).toBe(true);
  });

  it('should delete expired entries on cleanup', async () => {
    cache.set('key1', 'value1');

    // Wait for data to expire (TTL * 2)
    await new Promise(resolve => setTimeout(resolve, 2100));

    const removed = cache.cleanup();
    expect(removed).toBe(1);
    expect(cache.get('key1')).toBeNull();
  });

  it('should generate consistent cache keys', () => {
    const key1 = cache.generateKey('/api/cases', { id: '1', filter: 'active' });
    const key2 = cache.generateKey('/api/cases', { filter: 'active', id: '1' });

    expect(key1).toBe(key2);
  });
});
```

### Component Tests

Component tests verify UI behavior and user interactions.

**Example: Testing Button Component**

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} disabled>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.firstChild).toHaveClass('bg-blue-600');
  });

  it('should support custom className', () => {
    const { container } = render(
      <Button className="custom-class">Click me</Button>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

**Example: Testing CaseCard Component**

```typescript
// src/components/CaseCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CaseCard from './CaseCard';

const mockCase = {
  id: '1',
  publicId: 'CASE-001',
  title: 'Test Case',
  sector: 'Healthcare',
  subsector: 'Hospital',
  severity: 'high',
  tags: ['malware', 'ransomware'],
  incident_overview: 'Test overview',
  status: 'resolved',
};

describe('CaseCard', () => {
  it('should render case title and ID', () => {
    render(
      <BrowserRouter>
        <CaseCard case={mockCase} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Case')).toBeInTheDocument();
    expect(screen.getByText('CASE-001')).toBeInTheDocument();
  });

  it('should display severity badge', () => {
    render(
      <BrowserRouter>
        <CaseCard case={mockCase} />
      </BrowserRouter>
    );

    const badge = screen.getByText(/high/i);
    expect(badge).toHaveClass('bg-red-900');
  });

  it('should render tags', () => {
    render(
      <BrowserRouter>
        <CaseCard case={mockCase} />
      </BrowserRouter>
    );

    expect(screen.getByText('malware')).toBeInTheDocument();
    expect(screen.getByText('ransomware')).toBeInTheDocument();
  });

  it('should truncate long overview text', () => {
    const longCase = {
      ...mockCase,
      incident_overview: 'A'.repeat(200),
    };

    render(
      <BrowserRouter>
        <CaseCard case={longCase} />
      </BrowserRouter>
    );

    const overview = screen.getByText(/A+/);
    expect(overview.textContent?.length).toBeLessThan(200);
  });

  it('should link to case detail page', () => {
    render(
      <BrowserRouter>
        <CaseCard case={mockCase} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/case/1');
  });
});
```

### Integration Tests

Integration tests verify multiple components working together.

**Example: Testing API Integration**

```typescript
// src/api.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getAllCases } from './api';

// Mock Supabase client
vi.mock('./supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        data: [{ id: '1', title: 'Test Case' }],
        error: null,
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '1', title: 'New Case' },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '1', title: 'Updated Case' },
              error: null,
            })),
          })),
        })),
      })),
    })),
  },
}));

describe('API Integration', () => {
  it('should fetch cases', async () => {
    const cases = await getAllCases();
    expect(cases).toHaveLength(1);
    expect(cases[0].title).toBe('Test Case');
  });
});

> **Note:** Write operations (create/delete) are handled by secured admin tooling and should never run in the public client bundle.
```

## Testing Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### Testing Error Handling

```typescript
it('should handle errors gracefully', async () => {
  const mockError = new Error('Network error');
  vi.spyOn(api, 'fetchData').mockRejectedValue(mockError);

  await expect(fetchData()).rejects.toThrow('Network error');
});
```

### Testing Loading States

```typescript
it('should show loading spinner while fetching', () => {
  render(<CaseList />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
it('should handle form submission', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});
```

### Testing Accessibility

```typescript
it('should have proper ARIA labels', () => {
  render(<SearchForm />);

  const searchInput = screen.getByRole('searchbox');
  expect(searchInput).toHaveAttribute('aria-label', 'Search cases');
});

it('should support keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<Menu />);

  await user.tab();
  expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus();

  await user.keyboard('{Enter}');
  expect(window.location.pathname).toBe('/');
});
```

## Mocking

### Mocking Supabase Client

```typescript
// tests/mocks/supabase.ts
import { vi } from 'vitest';

export const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      data: [],
      error: null,
    })),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
  auth: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(() => ({
      data: { user: { id: '1', email: 'test@example.com' } },
      error: null,
    })),
  },
};

// Use in tests:
vi.mock('../supabaseClient', () => ({
  supabase: mockSupabase,
}));
```

### Mocking LocalStorage

```typescript
// tests/mocks/localStorage.ts
export const mockLocalStorage = (() => {
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
})();

// Use in tests:
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});
```

### Mocking React Router

```typescript
// tests/mocks/router.tsx
import { MemoryRouter } from 'react-router-dom';

export const renderWithRouter = (ui: React.ReactElement, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  );
};
```

### Mocking Context Providers

```typescript
// tests/mocks/AuthContext.tsx
import { vi } from 'vitest';
import { AuthContext } from '../../contexts/AuthContext';

export const mockAuthContext = {
  user: { id: '1', email: 'test@example.com' },
  isAdmin: true,
  loading: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
};

export const renderWithAuth = (ui: React.ReactElement, authValue = mockAuthContext) => {
  return render(
    <AuthContext.Provider value={authValue}>
      {ui}
    </AuthContext.Provider>
  );
};
```

## Coverage

### Coverage Goals

- **Overall:** 80%+ coverage
- **Critical paths:** 90%+ coverage (authentication, data validation, API calls)
- **Utilities:** 100% coverage (pure functions)
- **Components:** 70%+ coverage (UI components)

### Viewing Coverage

Generate HTML coverage report:

```bash
npm run test:coverage
```

Open `coverage/index.html` in browser to view detailed report.

### Coverage Configuration

Coverage settings in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  exclude: [
    'node_modules/',
    'tests/',
    '**/*.config.*',
    '**/*.d.ts',
    '**/dist/**',
    '**/*.test.{ts,tsx}',
    '**/__tests__/**',
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

### Excluding Code from Coverage

Use `/* istanbul ignore next */` comment:

```typescript
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ BAD - Testing implementation details
it('should update state', () => {
  const { result } = renderHook(() => useState(0));
  expect(result.current[0]).toBe(0);
});

// ✅ GOOD - Testing user-visible behavior
it('should display count after increment', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ BAD
it('works', () => { /* ... */ });

// ✅ GOOD
it('should display error message when email is invalid', () => { /* ... */ });
```

### 3. Arrange-Act-Assert Pattern

```typescript
it('should calculate total price', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ];

  // Act
  const total = calculateTotal(items);

  // Assert
  expect(total).toBe(35);
});
```

### 4. Test Edge Cases

```typescript
describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('should reject email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('should handle whitespace', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true);
  });
});
```

### 5. Keep Tests Independent

```typescript
// ❌ BAD - Tests depend on each other
let user: User;

it('should create user', () => {
  user = createUser({ name: 'John' });
  expect(user.name).toBe('John');
});

it('should update user', () => {
  user.name = 'Jane'; // Depends on previous test
  expect(user.name).toBe('Jane');
});

// ✅ GOOD - Each test is independent
it('should create user', () => {
  const user = createUser({ name: 'John' });
  expect(user.name).toBe('John');
});

it('should update user', () => {
  const user = createUser({ name: 'John' });
  user.name = 'Jane';
  expect(user.name).toBe('Jane');
});
```

### 6. Use Data-Testid Sparingly

```typescript
// ❌ BAD - Overusing data-testid
<button data-testid="submit-button">Submit</button>
screen.getByTestId('submit-button');

// ✅ GOOD - Use semantic queries
<button type="submit">Submit</button>
screen.getByRole('button', { name: /submit/i });
```

### 7. Clean Up After Tests

```typescript
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test
```

## Troubleshooting

### Tests Timing Out

Increase timeout in test file:

```typescript
it('should handle slow operation', async () => {
  // ... test code
}, { timeout: 10000 }); // 10 seconds
```

Or globally in config:

```typescript
export default defineConfig({
  test: {
    testTimeout: 10000,
  },
});
```

### Mock Not Working

Ensure mock is defined before imports:

```typescript
// ❌ BAD
import { fetchData } from './api';
vi.mock('./api');

// ✅ GOOD
vi.mock('./api');
import { fetchData } from './api';
```

### Component Not Rendering

Check if required providers are wrapped:

```typescript
// ❌ BAD
render(<AdminPage />);

// ✅ GOOD
render(
  <BrowserRouter>
    <AuthProvider>
      <AdminPage />
    </AuthProvider>
  </BrowserRouter>
);
```

### Cannot Find Element

Use `screen.debug()` to see rendered output:

```typescript
render(<MyComponent />);
screen.debug(); // Prints DOM to console
```

### Async Test Failures

Use `waitFor` for async updates:

```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Coverage Not Including File

Ensure file is imported in tests:

```typescript
// Add import even if not directly tested
import './utils/helperFunctions';
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)

---

**For questions or issues with testing, please open an issue on GitHub or contact the development team.**
