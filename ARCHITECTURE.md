# Architecture Documentation - Web Foundation

## Overview

Web Foundation is a comprehensive React component library built with TypeScript, designed to provide consistent UI components and theming across multiple websites (krisarmstrong.org, WiFi Vigilante, Intrinsic Momentum Mindset).

**Architecture Style:** Component-Based Architecture with Atomic Design Principles

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Directory Structure](#directory-structure)
3. [Component Hierarchy](#component-hierarchy)
4. [Design Token System](#design-token-system)
5. [Theme Architecture](#theme-architecture)
6. [Build System](#build-system)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Pipeline](#deployment-pipeline)
9. [Design Patterns](#design-patterns)
10. [Performance Considerations](#performance-considerations)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Consumer Applications                  │
│  (krisarmstrong.org, wifivigilante.com, intrinsic...)   │
└───────────────────────┬─────────────────────────────────┘
                        │ npm install
                        ↓
┌─────────────────────────────────────────────────────────┐
│              @krisarmstrong/web-foundation              │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │   Components   │  │     Themes     │  │   Utils   │ │
│  │  (UI/Feature)  │  │   (3 brands)   │  │  (Hooks)  │ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │  Design Tokens │  │     Context    │  │    CSS    │ │
│  │  (colors/size) │  │   (ThemeProv)  │  │ (Tailwind)│ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────┘
                        │ Peer Dependencies
                        ↓
┌─────────────────────────────────────────────────────────┐
│    React 19 │ React Router 7 │ Tailwind CSS 4          │
└─────────────────────────────────────────────────────────┘
```

### Package Architecture

**Package Type:** Dual ESM/CJS npm library
**Exports:**
- Main bundle: `@krisarmstrong/web-foundation`
- Tokens: `@krisarmstrong/web-foundation/tokens`
- CSS: `@krisarmstrong/web-foundation/dist/index.css`

**Peer Dependencies (Optional):**
- React 19.2.0+ (required for usage)
- React DOM 19.2.0+
- React Router DOM 7.9.6+ (for routing components)
- Sentry React 10.25.0+ (for error tracking)
- Lucide React 0.553.0+ (for icons)

---

## Directory Structure

```
web-foundation/
├── src/
│   ├── components/           # React components (primary exports)
│   │   ├── ui/              # Atomic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Typography.tsx
│   │   ├── layout/          # Layout primitives
│   │   │   ├── PageShell.tsx
│   │   │   └── Section.tsx
│   │   ├── feature/         # Feature components
│   │   │   ├── ContactForm.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── diagnostic/      # Development/debug components
│   │       ├── ThemeCanary.tsx
│   │       └── ThemeDiagnostics.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useClickOutside.ts
│   │   ├── useEscapeKey.ts
│   │   ├── useProgressiveLoad.ts
│   │   ├── useBodyScrollLock.ts
│   │   └── useTelemetry.ts
│   ├── context/             # React Context providers
│   │   └── ThemeContext.tsx # Theme/color mode management
│   ├── themes/              # Pre-built theme configurations
│   │   ├── krisarmstrong.ts
│   │   ├── wifivigilante.ts
│   │   └── intrinsic.ts
│   ├── utils/               # Utility functions
│   │   └── env.ts           # Environment detection
│   ├── constants/           # Shared constants
│   │   └── socialIcons.tsx  # Social media icons
│   ├── tokens.ts            # Design tokens export
│   ├── types.ts             # Shared TypeScript types
│   ├── index.ts             # Main exports
│   ├── index.css            # Global styles (Tailwind)
│   └── __tests__/           # Test files
├── dist/                    # Compiled output (generated)
│   ├── index.js             # ESM bundle
│   ├── index.cjs            # CommonJS bundle
│   ├── index.d.ts           # TypeScript definitions
│   ├── index.css            # Compiled CSS
│   └── ...
├── scripts/                 # Build/maintenance scripts
├── .github/                 # CI/CD workflows
├── docs/                    # Documentation
├── ARCHITECTURE.md          # This file
├── THEMING.md               # Theme system guide
├── CONTRIBUTING.md          # Contributor guide
└── README.md                # Package overview
```

---

## Component Hierarchy

### Atomic Design Classification

We follow a modified atomic design methodology:

#### 1. **Atoms** (UI Components - `src/components/ui/`)
Smallest, reusable building blocks:
- Button
- Input, TextInput, SearchInput
- Typography (H1, H2, P, Tag, Badge)
- Avatar
- Card, CardContent, CardTitle
- Skeleton, SkeletonText

#### 2. **Molecules** (Layout Components - `src/components/layout/`)
Simple combinations of atoms:
- Section
- PageShell
- Layout

#### 3. **Organisms** (Feature Components - `src/components/`)
Complex, functional components:
- Navbar, PrimaryNav
- Footer
- ContactForm
- ContentCard, ServiceCard, NavCard
- ContentSearch, SiteSearch, ContentSort
- StarRating
- Breadcrumbs
- PageHeader

#### 4. **Templates** (Compositions)
Provided by consuming applications using library components.

---

## Design Token System

### Token Architecture

Design tokens are the single source of truth for design decisions, stored in `src/tokens.ts`.

```typescript
Design Tokens
├── Color Tokens
│   ├── Brand Colors (primary, accent)
│   ├── Surface Colors (base, raised, border, hover)
│   ├── Text Colors (primary, muted, accent, inverse)
│   ├── Interactive Colors (default, hover, active, focus, disabled)
│   └── Status Colors (success, warning, error, info)
├── Layout Tokens
│   ├── Spacing (0-96 scale)
│   ├── Border Radius (sm, md, lg, xl, 2xl)
│   └── Breakpoints (sm, md, lg, xl, 2xl)
└── Typography Tokens
    ├── Font Families (heading, body, mono)
    ├── Font Sizes (xs, sm, base, lg, xl, 2xl...)
    ├── Font Weights (light, normal, medium, semibold, bold)
    └── Line Heights (tight, normal, relaxed)
```

### Token Usage Flow

```
1. Define in tokens.ts
   ↓
2. Import in tailwind.config.js
   ↓
3. Generate Tailwind utilities
   ↓
4. Use in components (className="bg-surface-raised")
   ↓
5. CSS custom properties for runtime theming
```

---

## Theme Architecture

### Theme System Design

```
┌──────────────────────────────────────────────────────┐
│                   ThemeProvider                      │
│  (Root of React tree)                                │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  Theme Configuration (ThemeConfig)          │    │
│  │  - brand, surface, text, interactive, status│    │
│  └─────────────────────────────────────────────┘    │
│                         │                            │
│                         ↓                            │
│  ┌─────────────────────────────────────────────┐    │
│  │  CSS Custom Properties Injection            │    │
│  │  document.documentElement.style.setProperty()│   │
│  └─────────────────────────────────────────────┘    │
│                         │                            │
│                         ↓                            │
│  ┌─────────────────────────────────────────────┐    │
│  │  Color Mode (light/dark/auto)               │    │
│  │  document.documentElement.classList         │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
                          │
                          ↓
┌──────────────────────────────────────────────────────┐
│              All Child Components                    │
│  Access theme via useTheme() or useOptionalTheme()  │
└──────────────────────────────────────────────────────┘
```

### Theme Customization Levels

1. **Pre-built Themes** - Use existing themes (`krisarmstrongTheme`, etc.)
2. **Theme Extension** - Spread existing theme and override specific values
3. **Custom Theme** - Create new theme from scratch
4. **Runtime Theme Updates** - Modify theme dynamically with `setTheme()`

---

## Build System

### Build Pipeline

```
Source Files (TypeScript + CSS)
           ↓
    ┌─────────────────┐
    │  tsup (JS/TS)   │ → ESM + CJS + .d.ts
    └─────────────────┘
           ↓
    ┌─────────────────┐
    │ Tailwind CLI    │ → Minified CSS
    └─────────────────┘
           ↓
       dist/ folder
```

### Build Configuration

**tsup (TypeScript/JavaScript):**
- Entry points: `src/index.ts`, `src/tokens.ts`
- Outputs: ESM (`.js`), CJS (`.cjs`), TypeScript definitions (`.d.ts`)
- Features: Source maps, code splitting, tree shaking

**Tailwind CSS:**
- Input: `src/index.css`
- Output: `dist/index.css` (minified)
- Purge: Configured for production tree-shaking

### Bundle Analysis

```
dist/
├── index.js      (122KB ESM)
├── index.cjs     (138KB CJS)
├── index.css     (61KB minified)
├── tokens.js     (4KB)
└── *.map files   (source maps)
```

---

## Testing Strategy

### Test Pyramid

```
        ┌───────┐
        │  E2E  │ (Future: Playwright)
        └───────┘
      ┌───────────┐
      │Integration│ (Planned: Multi-component)
      └───────────┘
    ┌───────────────┐
    │  Unit Tests   │ (Current: Vitest + Testing Library)
    └───────────────┘
```

### Testing Stack

- **Framework:** Vitest 4.0.9
- **UI Testing:** @testing-library/react 16.3.0
- **DOM Environment:** jsdom 27.2.0
- **Coverage:** v8 (target 50%+)
- **Browser Testing:** @vitest/browser-playwright 4.0.9

### Test Organization

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      # Co-located tests
├── hooks/
│   ├── useClickOutside.ts
│   └── useClickOutside.test.ts
└── __tests__/
    └── setup.ts              # Global test setup
```

---

## Deployment Pipeline

### CI/CD Workflow (GitHub Actions)

```
Push to main/PR
     ↓
┌─────────────────┐
│   Install deps  │ (npm ci)
└─────────────────┘
     ↓
┌─────────────────┐
│   Lint & Type   │ (ESLint + tsc)
└─────────────────┘
     ↓
┌─────────────────┐
│   Run Tests     │ (vitest)
└─────────────────┘
     ↓
┌─────────────────┐
│     Build       │ (npm run build)
└─────────────────┘
     ↓
  [Manual Release]
     ↓
┌─────────────────┐
│  Publish to npm │ (with provenance)
└─────────────────┘
```

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v0.x.x`
4. Push tag: `git push --tags`
5. GitHub Release triggers publish workflow
6. npm publish with provenance

---

## Design Patterns

### 1. **Polymorphic Components**
Components that can render as different elements:
```tsx
<Button as="button">Button Element</Button>
<Button as="Link" to="/path">React Router Link</Button>
<Button as="a" href="url">Anchor Element</Button>
```

### 2. **Compound Components**
Related components that work together:
```tsx
<Card>
  <CardTitle>Title</CardTitle>
  <CardContent>Content</CardContent>
</Card>
```

### 3. **Custom Hooks**
Reusable stateful logic:
```tsx
const { visibleItems, loadMore } = useProgressiveLoad(items);
const ref = useClickOutside<HTMLDivElement>(handleClose);
```

### 4. **Context + Provider Pattern**
Global state management:
```tsx
<ThemeProvider initialTheme={theme}>
  <App />
</ThemeProvider>

const { theme, setTheme } = useTheme();
```

### 5. **Render Props** (Limited Usage)
Flexible component composition:
```tsx
<Navbar mobileActions={<Actions />} />
```

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Separate entry points (index.ts, tokens.ts)
   - Tree-shakeable ESM exports
   - Consumer apps can import only what they need

2. **CSS Optimization**
   - Tailwind purge removes unused styles
   - Minified CSS output
   - Critical CSS inlined by consumers

3. **React Performance**
   - useMemo for expensive computations
   - useCallback for stable function references
   - React.memo for expensive re-renders (selective)

4. **Bundle Size**
   - Total: ~300KB (uncompressed)
   - Gzipped: ~115KB
   - Peer dependencies reduce bundle duplication

### Performance Metrics

```
First Paint: < 100ms (CSS-only)
Interactive: < 500ms (with React)
Bundle Parse: < 200ms
Tree Shaking: Enabled (ESM)
```

---

## Security Architecture

### Security Layers

1. **Input Sanitization** - DOMPurify for user content
2. **XSS Prevention** - React auto-escaping + explicit sanitization
3. **CSS Injection Prevention** - Color validation in ThemeContext
4. **Dependency Security** - Regular npm audit, automated updates
5. **Secret Management** - Environment variables, rotation docs
6. **Type Safety** - TypeScript strict mode eliminates runtime errors

### Security Best Practices

- No `eval()` or `Function()` constructors
- No `dangerouslySetInnerHTML` without DOMPurify
- All user inputs validated and sanitized
- ESLint security plugins active
- No secrets in source code
- HTTPS-only in production

---

## Future Architecture

### Planned Enhancements

1. **Accessibility Layer**
   - ARIA live regions
   - Focus management utilities
   - Screen reader testing

2. **Animation System**
   - Framer Motion integration
   - Shared animation tokens
   - Reduced motion support

3. **Form System**
   - Enhanced form validation
   - Form state management
   - Multi-step form support

4. **Documentation Site**
   - Interactive component playground
   - Live theme customization
   - API reference with examples

---

## Appendix

### Key Metrics

| Metric | Value |
|--------|-------|
| Total Components | 40+ |
| Lines of Code | 5,700+ |
| Test Coverage | 50%+ (target) |
| Bundle Size (gzip) | 115KB |
| Dependencies | 1 (dompurify) |
| Peer Dependencies | 5 (optional) |
| Supported Browsers | Last 2 versions |
| TypeScript Version | 5.9.3 |
| React Version | 19.2.0 |

### Related Documentation

- [THEMING.md](./THEMING.md) - Comprehensive theming guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [README.md](./README.md) - Package overview

---

**Last Updated:** 2025-11-18
**Version:** 0.9.7
**Maintainer:** Kris Armstrong
