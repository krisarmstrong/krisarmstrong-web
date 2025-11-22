# Testing Guide

This document outlines the testing strategy, patterns, and best practices for the krisarmstrong-web monorepo.

## Overview

**Test Framework**: Vitest 4.0.x
**Testing Library**: @testing-library/react
**Total Tests**: 188 passing across all apps and packages

### Test Distribution

- **web-foundation**: 60 tests (component library)
- **intrinsic**: 46 tests (coaching website)
- **krisarmstrong**: 42 tests (portfolio & blog)
- **wifivigilante**: 40 tests (case library)

## Running Tests

### All Tests

```bash
# Run all tests across the monorepo
npm test

# Run tests in watch mode (from package directory)
cd packages/web-foundation
npm run test:watch
```

### Individual Apps

```bash
# Intrinsic
cd apps/intrinsic
npm test

# Kris Armstrong
cd apps/krisarmstrong
npm test

# Wi-Fi Vigilante
cd apps/wifivigilante
npm test

# Web Foundation
cd packages/web-foundation
npm test
```

### Coverage

```bash
# Generate coverage report
npm run test:coverage --workspace=<workspace-name>

# Example
npm run test:coverage --workspace=@krisarmstrong/web-foundation
```

---

## Testing Patterns

### Component Testing

#### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testing Components with Router

```typescript
import { BrowserRouter } from 'react-router-dom';

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
```

#### Testing Components with Mocked Dependencies

```typescript
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

// Mock web-foundation components
vi.mock('@krisarmstrong/web-foundation', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navbar: vi.fn((props) => (
      <nav data-testid="mock-navbar">
        <div data-testid="navbar-logo">{props.logo}</div>
        <div data-testid="navbar-nav-items">
          {props.navItems?.map((item: { path: string; label: string }) => (
            <a key={item.path} href={item.path}>{item.label}</a>
          ))}
        </div>
      </nav>
    )),
    ThemeToggle: vi.fn(() => <div data-testid="mock-theme-toggle">Theme Toggle</div>),
  };
});

describe('Navbar', () => {
  it('renders with mocked web-foundation components', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-theme-toggle')).toBeInTheDocument();
  });
});
```

### Testing with Framer Motion

Framer Motion animations need to be mocked to avoid timing issues in tests:

```typescript
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: Record<string, unknown>) => <article {...props}>{children}</article>,
  },
}));
```

**Important**: Match `motion.*` elements to actual HTML elements for proper role queries:

- `motion.div` → `<div>`
- `motion.article` → `<article>`
- `motion.section` → `<section>`

### Testing Theme Context

Theme-dependent components require `localStorage.clear()` in `beforeEach` to prevent test pollution:

```typescript
describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear any applied styles
    document.documentElement.className = '';
    document.documentElement.style.cssText = '';

    // Clear localStorage to prevent theme persistence between tests
    localStorage.clear();
  });

  it('applies theme correctly', () => {
    const customTheme = {
      brand: { primary: '#ff0000', accent: '#00ff00' },
      // ... other theme properties
    };

    render(
      <ThemeProvider initialTheme={customTheme} initialMode="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.style.getPropertyValue('--color-brand-primary'))
      .toBe('#ff0000');
  });
});
```

### Async Testing

#### Testing with waitFor

```typescript
import { waitFor } from '@testing-library/react';

it('loads and displays blog posts', async () => {
  render(<Blog />);

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.getByText('Technical Blog')).toBeInTheDocument();
  });

  // Verify content loaded
  const postTitles = screen.getAllByRole('heading', { level: 2 });
  expect(postTitles.length).toBeGreaterThan(0);
});
```

#### Testing Error States

```typescript
it('shows error state when fetch fails', async () => {
  // Mock fetch to reject
  global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

  render(<BlogPost />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Forms

```typescript
import { fireEvent, waitFor } from '@testing-library/react';

it('submits contact form successfully', async () => {
  const onSuccess = vi.fn();

  render(<ContactForm endpoint="/api/contact" onSuccess={onSuccess} />);

  // Fill form
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John Doe' }
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'john@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: 'Hello world' }
  });

  // Submit
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});
```

---

## Mock Patterns

### Mocking External Libraries

#### Supabase

```typescript
vi.mock('../lib/supabase', () => ({
  getAllBlogPosts: vi.fn(() => Promise.resolve(mockPosts)),
  getBlogPost: vi.fn((slug) => Promise.resolve(mockPosts.find((p) => p.slug === slug))),
}));
```

#### File Saver

```typescript
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));
```

#### DOCX

```typescript
vi.mock('docx', () => ({
  Document: class MockDocument {
    constructor() {}
  },
  Packer: {
    toBlob: vi.fn(() => Promise.resolve(new Blob(['mock docx content']))),
  },
  Paragraph: class MockParagraph {
    constructor(options: unknown) {
      return options;
    }
  },
  TextRun: class MockTextRun {
    constructor(text: unknown) {
      return { text };
    }
  },
  HeadingLevel: {
    HEADING_1: 'HEADING_1',
    HEADING_2: 'HEADING_2',
    HEADING_3: 'HEADING_3',
  },
}));
```

### Mocking Window/Global APIs

```typescript
// Mock window.print
global.print = vi.fn();

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mock' }),
  } as Response)
);

// Mock localStorage (if not using vi.stubGlobal)
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

---

## Best Practices

### DO ✅

1. **Test user behavior, not implementation**

   ```typescript
   // ✅ Good - tests what user sees
   expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

   // ❌ Bad - tests implementation
   expect(component.state.isSubmitting).toBe(false);
   ```

2. **Use semantic queries (by role, label, text)**

   ```typescript
   // ✅ Best - accessible
   screen.getByRole('button', { name: 'Submit' });
   screen.getByLabelText('Email');

   // 👍 Good - for non-interactive elements
   screen.getByText('Welcome');

   // 👎 Avoid - brittle
   screen.getByTestId('submit-button');
   ```

3. **Clear test state between runs**

   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
     localStorage.clear();
   });

   afterEach(() => {
     vi.clearAllMocks();
   });
   ```

4. **Use descriptive test names**

   ```typescript
   // ✅ Good - describes behavior
   it('displays error message when email is invalid', () => {});

   // ❌ Bad - vague
   it('works', () => {});
   ```

5. **Test edge cases and error states**
   ```typescript
   describe('ContactForm', () => {
     it('handles empty fields');
     it('handles invalid email format');
     it('handles network errors');
     it('handles successful submission');
   });
   ```

### DON'T ❌

1. **Don't skip tests without a very good reason**

   ```typescript
   // ❌ Bad
   it.skip('this test is broken', () => {});

   // ✅ Good - fix the test or remove it
   it('validates email format', () => {});
   ```

2. **Don't test implementation details**

   ```typescript
   // ❌ Bad - testing internal state
   expect(component.state.count).toBe(1);

   // ✅ Good - testing user-visible behavior
   expect(screen.getByText('Count: 1')).toBeInTheDocument();
   ```

3. **Don't use broad selectors**

   ```typescript
   // ❌ Bad - too broad
   const buttons = container.querySelectorAll('button');

   // ✅ Good - specific
   const submitButton = screen.getByRole('button', { name: 'Submit' });
   ```

4. **Don't forget to clean up**

   ```typescript
   // ❌ Bad - no cleanup
   beforeEach(() => {
     global.fetch = mockFetch;
   });

   // ✅ Good - cleanup after
   afterEach(() => {
     vi.restoreAllMocks();
   });
   ```

---

## Common Issues and Solutions

### Issue: localStorage Pollution

**Problem**: Tests failing because theme persists between tests

**Solution**:

```typescript
beforeEach(() => {
  localStorage.clear();
});
```

### Issue: Cannot Find Role 'article'

**Problem**: Framer Motion mock doesn't render actual article elements

**Solution**: Update mock to render correct HTML element:

```typescript
vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: Record<string, unknown>) => (
      <article {...props}>{children}</article>
    ),
  },
}));
```

### Issue: "Objects are not valid as a React child"

**Problem**: Mock returning objects instead of React elements

**Solution**: Use optional chaining and return proper JSX:

```typescript
Navbar: vi.fn((props) => (
  <nav>
    {props.navItems?.map((item: NavItem) => (
      <a key={item.path} href={item.path}>{item.label}</a>
    ))}
  </nav>
)),
```

### Issue: Async Tests Timing Out

**Problem**: `waitFor` not resolving

**Solution**: Increase timeout or check that the condition will eventually be true:

```typescript
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  },
  { timeout: 3000 }
);
```

---

## CI/CD Integration

Tests run automatically on:

### Pre-push Hook

```bash
# Runs before every git push
npm run build    # Build all packages
npm test         # Run all tests
```

### GitHub Actions

```yaml
# .github/workflows/ci.yml
- Run tests on Node 18.x, 20.x, 22.x
- Generate coverage reports
- Verify builds succeed
```

---

## Test Coverage Goals

- **Critical paths**: >80% coverage
- **UI components**: >70% coverage
- **Utilities/hooks**: >90% coverage

Check coverage:

```bash
npm run test:coverage --workspace=<workspace>
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [AAA Pattern](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)

---

## Getting Help

- Check existing test files for examples
- Review this guide for patterns
- Ask questions in GitHub issues
- Consult [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow

Happy testing! 🧪
