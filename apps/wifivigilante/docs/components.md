# Component Documentation

Comprehensive guide to all UI components in Wi-Fi Vigilante.

## Table of Contents

- [Overview](#overview)
- [Design System](#design-system)
- [UI Components](#ui-components)
  - [Button](#button)
  - [Card](#card)
  - [Input](#input)
  - [Badge](#badge)
  - [Tag](#tag)
  - [Typography](#typography)
- [Feature Components](#feature-components)
  - [CaseCard](#casecard)
  - [CaseDisplay](#casedisplay)
  - [CaseFilters](#casefilters)
  - [FilterDrawer](#filterdrawer)
- [Layout Components](#layout-components)
  - [Header](#header)
  - [Footer](#footer)
  - [Layout](#layout)
- [State Components](#state-components)
  - [ErrorState](#errorstate)
  - [LoadingState](#loadingstate)
  - [ErrorBoundary](#errorboundary)
- [Utility Components](#utility-components)
  - [ProtectedRoute](#protectedroute)
  - [PageLoadingFallback](#pageloadingfallback)
- [Accessibility](#accessibility)
- [Best Practices](#best-practices)

## Overview

Wi-Fi Vigilante's component library follows atomic design principles with a focus on:

- **Reusability** - Components designed for multiple contexts
- **Accessibility** - WCAG 2.1 AA compliance
- **Type Safety** - Full TypeScript support
- **Performance** - Optimized rendering with React best practices
- **Consistency** - Unified design language across the app

## Design System

### Color Palette

```typescript
// Primary Colors
const colors = {
  primary: {
    blue: '#2563eb',      // bg-blue-600
    blueHover: '#1d4ed8', // bg-blue-700
  },

  // Severity Colors
  severity: {
    critical: '#991b1b',  // bg-red-900
    high: '#dc2626',      // bg-red-600
    medium: '#d97706',    // bg-yellow-600
    low: '#059669',       // bg-green-600
    info: '#2563eb',      // bg-blue-600
  },

  // Neutral Colors
  neutral: {
    background: '#1f2937', // bg-gray-800
    surface: '#374151',    // bg-gray-700
    border: '#4b5563',     // border-gray-600
    text: '#e5e7eb',       // text-gray-200
    textMuted: '#9ca3af',  // text-gray-400
  },
};
```

### Typography Scale

```typescript
const typography = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
};
```

### Spacing Scale

```typescript
const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};
```

## UI Components

### Button

Versatile button component supporting multiple variants, sizes, and states.

**Location:** `src/components/ui/Button.tsx`

#### Props

```typescript
interface ButtonProps {
  // Appearance
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';

  // State
  isLoading?: boolean;
  disabled?: boolean;

  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Content
  children?: React.ReactNode;
  className?: string;

  // Element type
  as?: 'button' | 'Link' | 'a';
  to?: string;        // For React Router Link
  href?: string;      // For anchor tag
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent) => void;
}
```

#### Usage Examples

**Basic Button**

```tsx
import { Button } from '@/components/ui/Button';

<Button onClick={() => console.log('clicked')}>
  Click Me
</Button>
```

**Button Variants**

```tsx
// Primary (default)
<Button variant="primary">Primary</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Danger
<Button variant="danger">Delete</Button>

// Warning
<Button variant="warning">Warning</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost
<Button variant="ghost">Ghost</Button>
```

**Button Sizes**

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**With Icons**

```tsx
import { Save, Trash, Download } from 'lucide-react';

<Button leftIcon={<Save size={16} />}>
  Save Changes
</Button>

<Button rightIcon={<Download size={16} />}>
  Download
</Button>

<Button variant="danger" leftIcon={<Trash size={16} />}>
  Delete
</Button>
```

**Loading State**

```tsx
<Button isLoading disabled>
  Saving...
</Button>
```

**As Link (React Router)**

```tsx
<Button as="Link" to="/cases">
  View Cases
</Button>
```

**As Anchor**

```tsx
<Button as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</Button>
```

#### Accessibility

- Supports keyboard navigation (Tab, Enter, Space)
- Focus ring with `focus:ring-2`
- Disabled state with `disabled:opacity-60`
- ARIA-compliant button roles
- Loading state shows spinner with proper ARIA labels

### Card

Container component for content sections.

**Location:** `src/components/ui/Card.tsx`

#### Props

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```

#### Components

**Card** - Main container

```tsx
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

**CardContent** - Content wrapper with padding

```tsx
<Card>
  <CardContent>
    <h2>Title</h2>
    <p>Content with default padding</p>
  </CardContent>
</Card>
```

#### Usage Examples

**Basic Card**

```tsx
import { Card, CardContent } from '@/components/ui/Card';

<Card>
  <CardContent>
    <h2 className="text-xl font-bold mb-2">Featured Case</h2>
    <p className="text-gray-400">Case details here...</p>
  </CardContent>
</Card>
```

**Custom Styling**

```tsx
<Card className="hover:border-blue-500 transition-colors cursor-pointer">
  <CardContent className="p-8">
    <p>Custom padding and hover effect</p>
  </CardContent>
</Card>
```

### Input

Styled input components for forms and search.

**Location:** `src/components/ui/Input.tsx`

#### SearchInput

```typescript
interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
}
```

#### Usage Examples

```tsx
import { SearchInput } from '@/components/ui/Input';
import { useState } from 'react';

const [searchQuery, setSearchQuery] = useState('');

<SearchInput
  placeholder="Search cases..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  ariaLabel="Search for cases"
  id="case-search"
/>
```

#### Accessibility

- Semantic `type="search"`
- Custom `aria-label` support
- Focus ring styling
- Placeholder contrast meets WCAG AA

### Badge

Status and severity indicators.

**Location:** `src/components/ui/Badge.tsx`

#### Props

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'default';
  className?: string;
}
```

#### Usage Examples

```tsx
import { Badge } from '@/components/ui/Badge';

// Severity badges
<Badge variant="critical">Critical</Badge>
<Badge variant="high">High</Badge>
<Badge variant="medium">Medium</Badge>
<Badge variant="low">Low</Badge>

// Info badge
<Badge variant="info">Active</Badge>

// Default
<Badge>Status</Badge>
```

#### Severity Colors

- **Critical:** Red (`bg-red-900`)
- **High:** Red (`bg-red-600`)
- **Medium:** Yellow (`bg-yellow-600`)
- **Low:** Green (`bg-green-600`)
- **Info:** Blue (`bg-blue-600`)

### Tag

Labels for categorization and filtering.

**Location:** `src/components/ui/Tag.tsx`

#### Props

```typescript
interface TagProps {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}
```

#### Usage Examples

```tsx
import { Tag } from '@/components/ui/Tag';

// Static tag
<Tag>Ransomware</Tag>

// Clickable tag
<Tag onClick={() => setFilter('malware')} active={filter === 'malware'}>
  Malware
</Tag>

// Multiple tags
<div className="flex flex-wrap gap-2">
  {tags.map(tag => (
    <Tag key={tag}>{tag}</Tag>
  ))}
</div>
```

### Typography

Standardized text components.

**Location:** `src/components/ui/Typography.tsx`

#### Components

```tsx
import { H1, H2, H3, Paragraph, Label } from '@/components/ui/Typography';

<H1>Main Heading</H1>
<H2>Section Heading</H2>
<H3>Subsection Heading</H3>
<Paragraph>Body text content</Paragraph>
<Label htmlFor="input-id">Form Label</Label>
```

## Feature Components

### CaseCard

Displays case summary in grid/list views.

**Location:** `src/components/CaseCard.tsx`

#### Props

```typescript
interface CaseCardProps {
  case: TransformedCase;
  onClick?: () => void;
  className?: string;
}
```

#### Usage

```tsx
import CaseCard from '@/components/CaseCard';

<CaseCard
  case={{
    id: '1',
    publicId: 'CASE-001',
    title: 'Hospital Ransomware Attack',
    sector: 'Healthcare',
    severity: 'critical',
    tags: ['ransomware', 'healthcare'],
    incident_overview: 'Overview text...',
  }}
  onClick={() => navigate(`/case/${case.id}`)}
/>
```

#### Features

- Severity badge
- Sector and subsector display
- Tag list
- Truncated overview with "Read more"
- Responsive design
- Hover effects

### CaseDisplay

Full case detail view with rich formatting.

**Location:** `src/components/CaseDisplay.tsx`

#### Props

```typescript
interface CaseDisplayProps {
  pageTitle: string;
  pageIcon: React.ReactNode;
  caseData: TransformedCase | null;
  isLoading: boolean;
  error: Error | { message: string } | null;
}
```

#### Usage

```tsx
import CaseDisplay from '@/components/CaseDisplay';
import { ShieldCheck } from 'lucide-react';

<CaseDisplay
  pageTitle="Case Details"
  pageIcon={<ShieldCheck size={32} className="text-blue-400" />}
  caseData={caseData}
  isLoading={loading}
  error={error}
/>
```

#### Features

- Loading state with spinner
- Error state with retry
- Rich text formatting
- Export to PDF/Markdown
- Print support
- Back navigation
- Metadata display
- Tools and tags
- Responsive layout

### CaseFilters

Advanced filtering interface for case browsing.

**Location:** `src/components/CaseFilters.tsx`

#### Props

```typescript
interface CaseFiltersProps {
  allCases: TransformedCase[];
  onFilteredCasesChange: (cases: TransformedCase[]) => void;
}
```

#### Usage

```tsx
import CaseFilters from '@/components/CaseFilters';

<CaseFilters
  allCases={allCases}
  onFilteredCasesChange={setFilteredCases}
/>
```

#### Features

- Text search across all fields
- Sector/subsector filtering
- Tool filtering
- Tag filtering
- Severity filtering
- Status filtering
- Real-time results
- Mobile-optimized drawer
- Clear filters button

### FilterDrawer

Mobile-friendly filter drawer.

**Location:** `src/components/FilterDrawer.tsx`

#### Props

```typescript
interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

#### Usage

```tsx
import FilterDrawer from '@/components/FilterDrawer';

<FilterDrawer isOpen={showFilters} onClose={() => setShowFilters(false)}>
  <div>Filter content here</div>
</FilterDrawer>
```

#### Features

- Slide-in animation
- Backdrop overlay
- Close button
- Trap focus
- Escape key support
- Responsive sizing

## Layout Components

### Header

Top navigation bar with logo and menu.

**Location:** `src/components/Header.tsx`

#### Features

- Logo with link to home
- Navigation menu (desktop)
- Mobile hamburger menu
- Active route highlighting
- Admin link (authenticated users)
- Sign in/out buttons
- Responsive design

#### Usage

```tsx
import Header from '@/components/Header';

<Header />
```

### Footer

Bottom site footer with links and info.

**Location:** `src/components/Footer.tsx`

#### Features

- Social media links
- Navigation links
- Copyright notice
- Responsive columns
- Icon components

#### Usage

```tsx
import Footer from '@/components/Footer';

<Footer />
```

### Layout

Main app layout wrapper with header and footer.

**Location:** `src/Layout.tsx`

#### Features

- Mobile menu state management
- Focus trap when menu open
- Body scroll lock
- Proper cleanup on unmount
- Outlet for React Router

#### Usage

```tsx
import Layout from '@/Layout';

<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    {/* Other routes */}
  </Route>
</Routes>
```

## State Components

### ErrorState

Error display components in multiple formats.

**Location:** `src/components/ErrorState.tsx`

#### Components

**ErrorMessage** - Inline error banner

```typescript
interface ErrorMessageProps {
  error?: { message?: string } | Error | string | null;
  onRetry?: () => void;
  className?: string;
}
```

**ErrorCard** - Card-style error display

```typescript
interface ErrorCardProps {
  error?: { message?: string } | Error | string | null;
  onRetry?: () => void;
}
```

**ErrorPage** - Full-page error view

```typescript
interface ErrorCardProps {
  error?: { message?: string } | Error | string | null;
  onRetry?: () => void;
}
```

#### Usage

```tsx
import { ErrorMessage, ErrorCard, ErrorPage } from '@/components/ErrorState';

// Inline error
<ErrorMessage
  error={error}
  onRetry={handleRetry}
  className="mb-4"
/>

// Card error
<ErrorCard
  error="Failed to load data"
  onRetry={refetch}
/>

// Full page error
<ErrorPage
  error={error}
  onRetry={() => window.location.reload()}
/>
```

### LoadingState

Loading spinners and skeletons.

**Location:** `src/components/LoadingState.tsx`

#### Components

**LoadingSpinner**

```typescript
interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}
```

**LoadingCard** - Card skeleton

**LoadingPage** - Full page spinner

#### Usage

```tsx
import { LoadingSpinner, LoadingCard, LoadingPage } from '@/components/LoadingState';

// Spinner
<LoadingSpinner size={24} className="text-blue-500" />

// Card skeleton
<LoadingCard />

// Full page
{isLoading && <LoadingPage />}
```

### ErrorBoundary

React error boundary for catching component errors.

**Location:** `src/components/ErrorBoundary.tsx`

#### Props

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

#### Usage

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### Features

- Catches React errors
- Custom fallback UI
- Error logging
- Production-ready

## Utility Components

### ProtectedRoute

Authentication guard for routes.

**Location:** `src/components/ProtectedRoute.tsx`

#### Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}
```

#### Usage

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

#### Features

- Checks authentication
- Validates admin role
- Redirects to sign-in
- Loading state

### PageLoadingFallback

Lazy loading placeholder.

**Location:** `src/components/PageLoadingFallback.tsx`

#### Usage

```tsx
import { lazy, Suspense } from 'react';
import PageLoadingFallback from '@/components/PageLoadingFallback';

const AdminPage = lazy(() => import('@/pages/Admin'));

<Suspense fallback={<PageLoadingFallback />}>
  <AdminPage />
</Suspense>
```

## Accessibility

### Keyboard Navigation

All interactive components support:

- **Tab** - Move between elements
- **Shift+Tab** - Move backwards
- **Enter/Space** - Activate buttons
- **Escape** - Close modals/drawers
- **Arrow keys** - Navigate lists/menus

### Screen Readers

Components include:

- Semantic HTML elements
- ARIA labels and roles
- Live regions for dynamic content
- Focus management
- Skip links

### Color Contrast

All text meets WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

### Focus Management

- Visible focus indicators
- Focus trap in modals
- Logical tab order
- Focus restoration

## Best Practices

### Component Structure

```tsx
// 1. Imports
import React from 'react';
import { ExternalLibrary } from 'external';
import { InternalUtil } from '@/utils';

// 2. Types
interface ComponentProps {
  // Props here
}

// 3. Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {
    // Handler logic
  };

  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Naming Conventions

- **PascalCase** for components: `CaseCard`, `ErrorMessage`
- **camelCase** for props: `isLoading`, `onClick`
- **kebab-case** for CSS classes: `bg-blue-600`, `border-gray-700`
- **UPPER_SNAKE_CASE** for constants: `MAX_LENGTH`, `API_URL`

### Props Pattern

```tsx
// Use destructuring with defaults
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  // Component logic
}
```

### Conditional Rendering

```tsx
// Use logical AND for simple conditions
{isLoading && <LoadingSpinner />}

// Use ternary for if/else
{error ? <ErrorMessage error={error} /> : <Content />}

// Use early return for complex conditions
if (!data) return <LoadingState />;
```

### Event Handlers

```tsx
// Name handlers with 'handle' prefix
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Logic
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

### Performance

```tsx
// Memoize expensive components
const MemoizedComponent = React.memo(Component);

// Use useCallback for handlers passed as props
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Use useMemo for expensive calculations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.date - b.date);
}, [items]);
```

### TypeScript

```tsx
// Always type props
interface Props {
  title: string;
  count: number;
  onUpdate: (value: number) => void;
}

// Use union types for variants
type Variant = 'primary' | 'secondary' | 'danger';

// Use optional props with ?
interface Props {
  required: string;
  optional?: number;
}
```

### Testing

```tsx
// Test component rendering
it('should render with title', () => {
  render(<Component title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});

// Test user interactions
it('should call onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

**For questions about components, please refer to the source code or contact the development team.**
