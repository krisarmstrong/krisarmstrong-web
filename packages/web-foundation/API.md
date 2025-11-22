# API Documentation - Web Foundation

Complete API reference for all exported components, hooks, and utilities.

## Table of Contents

- [Components](#components)
  - [UI Components](#ui-components)
  - [Layout Components](#layout-components)
  - [Feature Components](#feature-components)
- [Hooks](#hooks)
- [Context](#context)
- [Themes](#themes)
- [Types](#types)
- [Utilities](#utilities)

---

## Components

### UI Components

#### Button

Polymorphic button component with multiple variants and states.

**Import:**

```tsx
import { Button } from '@krisarmstrong/web-foundation';
```

**Props:**

| Prop        | Type                                                                        | Default     | Description                       |
| ----------- | --------------------------------------------------------------------------- | ----------- | --------------------------------- |
| `as`        | `'button' \| 'Link' \| 'a'`                                                 | `'button'`  | Element type to render            |
| `variant`   | `'primary' \| 'secondary' \| 'danger' \| 'warning' \| 'outline' \| 'ghost'` | `'primary'` | Visual variant                    |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                      | `'md'`      | Button size                       |
| `tone`      | `'blue' \| 'violet' \| 'sage' \| 'emerald'`                                 | `'blue'`    | Color tone (primary variant only) |
| `isLoading` | `boolean`                                                                   | `false`     | Shows loading spinner             |
| `disabled`  | `boolean`                                                                   | `false`     | Disables interaction              |
| `leftIcon`  | `ReactNode`                                                                 | -           | Icon before content               |
| `rightIcon` | `ReactNode`                                                                 | -           | Icon after content                |
| `className` | `string`                                                                    | -           | Additional CSS classes            |
| `onClick`   | `function`                                                                  | -           | Click handler                     |
| `type`      | `'button' \| 'submit' \| 'reset'`                                           | `'button'`  | Button type (when `as='button'`)  |
| `to`        | `string`                                                                    | -           | Destination (when `as='Link'`)    |
| `href`      | `string`                                                                    | -           | URL (when `as='a'`)               |
| `target`    | `string`                                                                    | -           | Target attribute (when `as='a'`)  |
| `rel`       | `string`                                                                    | -           | Rel attribute (when `as='a'`)     |

**Examples:**

```tsx
// Basic button
<Button onClick={handleClick}>Click Me</Button>

// Loading state
<Button isLoading={isSubmitting} disabled={isSubmitting}>
  Submit Form
</Button>

// As React Router Link
<Button as="Link" to="/dashboard" variant="primary" tone="violet">
  Dashboard
</Button>

// With icons
<Button leftIcon={<SaveIcon />} variant="primary">
  Save Changes
</Button>

// Different variants
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Outline</Button>
```

---

#### Card / CardContent / CardTitle

Container components for grouped content.

**Import:**

```tsx
import { Card, CardContent, CardTitle } from '@krisarmstrong/web-foundation';
```

**Card Props:**

| Prop        | Type        | Default | Description            |
| ----------- | ----------- | ------- | ---------------------- |
| `children`  | `ReactNode` | -       | Card content           |
| `className` | `string`    | -       | Additional CSS classes |

**Example:**

```tsx
<Card>
  <CardTitle>Card Title</CardTitle>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

---

#### Typography Components

H1, H2, H3, P, MutedText, SmallText, Tag, Badge components for consistent typography.

**Import:**

```tsx
import { H1, H2, P, MutedText, Tag } from '@krisarmstrong/web-foundation';
```

**Common Props:**

| Prop        | Type        | Default | Description            |
| ----------- | ----------- | ------- | ---------------------- |
| `children`  | `ReactNode` | -       | Text content           |
| `className` | `string`    | -       | Additional CSS classes |

**Examples:**

```tsx
<H1>Page Title</H1>
<H2>Section Heading</H2>
<P>Regular paragraph text</P>
<MutedText>Secondary information</MutedText>
<Tag tone="blue">Status Tag</Tag>
<Badge>New</Badge>
```

---

### Layout Components

#### PageShell

Main page container with consistent padding and max-width.

**Import:**

```tsx
import { PageShell } from '@krisarmstrong/web-foundation';
```

**Props:**

| Prop        | Type        | Default | Description            |
| ----------- | ----------- | ------- | ---------------------- |
| `children`  | `ReactNode` | -       | Page content           |
| `className` | `string`    | -       | Additional CSS classes |

**Example:**

```tsx
<PageShell>
  <h1>Page Content</h1>
  {/* Your content here */}
</PageShell>
```

---

### Feature Components

#### ContactForm

Full-featured contact form with validation and submission handling.

**Import:**

```tsx
import { ContactForm } from '@krisarmstrong/web-foundation';
```

**Props:**

| Prop           | Type                           | Default              | Description         |
| -------------- | ------------------------------ | -------------------- | ------------------- |
| `endpoint`     | `string`                       | **Required**         | Form submission URL |
| `surface`      | `'base' \| 'raised'`           | `'base'`             | Background surface  |
| `tone`         | `'blue' \| 'violet' \| 'sage'` | `'blue'`             | Color tone          |
| `labels`       | `object`                       | Default labels       | Custom field labels |
| `placeholders` | `object`                       | Default placeholders | Custom placeholders |
| `messages`     | `object`                       | Default messages     | Custom UI messages  |
| `onSuccess`    | `function`                     | -                    | Success callback    |
| `onError`      | `function`                     | -                    | Error callback      |

**Example:**

```tsx
<ContactForm
  endpoint="https://formspree.io/f/YOUR_ID"
  tone="sage"
  labels={{
    name: 'Your Name',
    email: 'Email Address',
    message: 'Your Message',
  }}
  onSuccess={() => console.log('Form submitted!')}
  onError={(error) => console.error(error)}
/>
```

---

#### Navbar

Responsive navigation bar with mobile menu support.

**Import:**

```tsx
import { Navbar } from '@krisarmstrong/web-foundation';
```

**Props:**

| Prop             | Type                           | Default      | Description              |
| ---------------- | ------------------------------ | ------------ | ------------------------ |
| `navItems`       | `NavItem[]`                    | **Required** | Navigation links         |
| `variant`        | `'blue' \| 'violet' \| 'sage'` | `'blue'`     | Color variant            |
| `desktopActions` | `ReactNode`                    | -            | Actions shown on desktop |
| `mobileActions`  | `ReactNode`                    | -            | Actions shown on mobile  |
| `mobileFooter`   | `ReactNode`                    | -            | Footer in mobile menu    |

**NavItem Type:**

```typescript
interface NavItem {
  label: string;
  path: string;
  external?: boolean;
}
```

**Example:**

```tsx
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

<Navbar navItems={navItems} variant="sage" desktopActions={<Button>Login</Button>} />;
```

---

## Hooks

### useTheme

Access and modify the current theme.

**Import:**

```tsx
import { useTheme } from '@krisarmstrong/web-foundation';
```

**Returns:**

```typescript
{
  theme: ThemeConfig;
  mode: 'light' | 'dark' | 'auto';
  setTheme: (theme: ThemeConfig) => void;
  setMode: (mode: ColorMode) => void;
}
```

**Example:**

```tsx
function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>;
}
```

---

### useProgressiveLoad

Hook for progressive/lazy loading of items (pagination, "load more" pattern).

**Import:**

```tsx
import { useProgressiveLoad } from '@krisarmstrong/web-foundation';
```

**Signature:**

```typescript
useProgressiveLoad<T>(
  items: T[],
  options?: {
    initialCount?: number;
    itemsPerLoad?: number;
  }
): {
  visibleItems: T[];
  remainingCount: number;
  loadMore: () => void;
  reset: () => void;
  hasMore: boolean;
  displayCount: number;
}
```

**Example:**

```tsx
function PostList({ posts }) {
  const { visibleItems, loadMore, hasMore } = useProgressiveLoad(posts, {
    initialCount: 12,
    itemsPerLoad: 12,
  });

  return (
    <>
      {visibleItems.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </>
  );
}
```

---

### useClickOutside

Detects clicks outside a referenced element.

**Import:**

```tsx
import { useClickOutside } from '@krisarmstrong/web-foundation';
```

**Signature:**

```typescript
useClickOutside<T extends HTMLElement>(
  callback: () => void,
  isActive?: boolean
): React.RefObject<T>
```

**Example:**

```tsx
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false), isOpen);

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}
```

---

### useEscapeKey

Handles Escape key press events.

**Import:**

```tsx
import { useEscapeKey } from '@krisarmstrong/web-foundation';
```

**Signature:**

```typescript
useEscapeKey(callback: () => void, isActive?: boolean): void
```

**Example:**

```tsx
function Modal({ onClose }) {
  useEscapeKey(onClose, true);

  return <div>Modal content</div>;
}
```

---

### useTelemetry

Analytics and error tracking abstraction.

**Import:**

```tsx
import { useTelemetry } from '@krisarmstrong/web-foundation';
```

**Returns:**

```typescript
{
  trackPageView: (properties?: object) => void;
  trackEvent: (name: string, properties?: object) => void;
  trackError: (error: Error, context?: object) => void;
  identify: (userId: string, traits?: object) => void;
}
```

**Example:**

```tsx
function Analytics() {
  const { trackEvent, trackPageView } = useTelemetry();

  useEffect(() => {
    trackPageView({ page: 'Home' });
  }, []);

  const handlePurchase = () => {
    trackEvent('purchase_completed', {
      amount: 99.99,
      currency: 'USD',
    });
  };

  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

---

## Context

### ThemeProvider

Provides theme configuration and color mode to the component tree.

**Import:**

```tsx
import { ThemeProvider } from '@krisarmstrong/web-foundation';
```

**Props:**

| Prop                | Type                          | Default            | Description                 |
| ------------------- | ----------------------------- | ------------------ | --------------------------- |
| `children`          | `ReactNode`                   | **Required**       | App content                 |
| `initialTheme`      | `ThemeConfig`                 | `defaultDarkTheme` | Initial theme configuration |
| `initialMode`       | `'light' \| 'dark' \| 'auto'` | `'dark'`           | Initial color mode          |
| `allowThemeUpdates` | `boolean`                     | `true`             | Allow runtime theme changes |

**Example:**

```tsx
import { ThemeProvider, krisarmstrongTheme } from '@krisarmstrong/web-foundation';

function App() {
  return (
    <ThemeProvider initialTheme={krisarmstrongTheme} initialMode="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## Themes

Pre-built theme configurations.

### Available Themes

```tsx
import {
  defaultDarkTheme,
  defaultLightTheme,
  krisarmstrongTheme,
  wifivigilanteTheme,
  intrinsicTheme,
  intrinsicMomentumMindsetTheme,
} from '@krisarmstrong/web-foundation';
```

### Theme Configuration Structure

```typescript
interface ThemeConfig {
  brand?: {
    primary?: string;
    accent?: string;
  };
  surface?: {
    base?: string;
    raised?: string;
    border?: string;
    hover?: string;
  };
  text?: {
    primary?: string;
    muted?: string;
    accent?: string;
    inverse?: string;
  };
  interactive?: {
    default?: string;
    hover?: string;
    active?: string;
    focus?: string;
    disabled?: string;
  };
  status?: {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
  typography?: {
    fontFamily?: {
      heading?: string;
      body?: string;
      mono?: string;
    };
  };
}
```

---

## Types

Key TypeScript type exports.

### NavItem

```typescript
interface NavItem {
  label: string;
  path: string;
  external?: boolean;
}
```

### FooterLinks

```typescript
interface FooterLinks {
  legal?: { label: string; path: string }[];
  social?: { label: string; url: string; icon: ReactNode }[];
}
```

### SocialLink

```typescript
interface SocialLink {
  platform: string;
  url: string;
  icon: ReactNode;
}
```

---

## Utilities

### Environment Utilities

```tsx
import { isDevelopmentEnvironment, getSentry } from '@krisarmstrong/web-foundation';
```

**isDevelopmentEnvironment():**
Returns `true` if running in development mode.

**getSentry():**
Returns Sentry instance if available, otherwise `null`.

---

## Design Tokens

Import design tokens for Tailwind configuration.

```tsx
import { colorTokens, layoutTokens, typographyTokens } from '@krisarmstrong/web-foundation/tokens';
```

### Color Tokens

```typescript
colorTokens = {
  brand: { primary: string, accent: string },
  surface: { base: string, raised: string, border: string, hover: string },
  text: { primary: string, muted: string, accent: string, inverse: string },
  interactive: { ... },
  status: { ... }
}
```

### Layout Tokens

```typescript
layoutTokens = {
  spacing: { 0: '0', 1: '0.25rem', ... },
  borderRadius: { sm: '0.125rem', md: '0.375rem', ... },
  breakpoints: { sm: '640px', md: '768px', ... }
}
```

### Typography Tokens

```typescript
typographyTokens = {
  fontFamily: { heading: string[], body: string[], mono: string[] },
  fontSize: { xs: string, sm: string, ... },
  fontWeight: { light: number, normal: number, ... },
  lineHeight: { tight: string, normal: string, ... }
}
```

---

## Error Boundaries

### ErrorBoundary

React error boundary component.

**Import:**

```tsx
import { ErrorBoundary } from '@krisarmstrong/web-foundation';
```

**Props:**

| Prop       | Type        | Default          | Description       |
| ---------- | ----------- | ---------------- | ----------------- |
| `children` | `ReactNode` | **Required**     | Protected content |
| `fallback` | `ReactNode` | Default error UI | Custom error UI   |

**Example:**

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Best Practices

### Theme Usage

✅ **Do:**

```tsx
<div className="bg-surface-raised text-text-primary" />
```

❌ **Don't:**

```tsx
<div className="bg-gray-800 text-gray-100" />
```

### Component Composition

✅ **Do:**

```tsx
<Card>
  <CardTitle>Title</CardTitle>
  <CardContent>Content</CardContent>
</Card>
```

### Hook Usage

✅ **Do:**

```tsx
const ref = useClickOutside(() => handleClose(), isOpen);
```

❌ **Don't:**

```tsx
useClickOutside(() => handleClose()); // Missing isActive parameter
```

---

**Version:** 0.9.7
**Last Updated:** 2025-11-18

For more information, see:

- [THEMING.md](./THEMING.md) - Theming guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture documentation
- [README.md](./README.md) - Package overview
