# Architecture Documentation - Intrinsic Momentum Mindset

## Overview

Intrinsic Momentum Mindset is a professional coaching website built with modern web technologies, leveraging the `@krisarmstrong/web-foundation` component library for consistent UI/UX and theming.

**Architecture Style:** Single Page Application (SPA) with Client-Side Routing

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Component Architecture](#component-architecture)
5. [Routing Strategy](#routing-strategy)
6. [Theme System](#theme-system)
7. [Build System](#build-system)
8. [Deployment](#deployment)
9. [Performance Considerations](#performance-considerations)
10. [Design Patterns](#design-patterns)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│          Browser / User Interface                   │
└───────────────────┬─────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────┐
│         React 19 Application Layer                  │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────┐ │
│  │  Page         │  │  Layout       │  │  Config │ │
│  │  Components   │  │  Component    │  │  Files  │ │
│  └───────────────┘  └───────────────┘  └─────────┘ │
└───────────────────┬─────────────────────────────────┘
                    │ uses
                    ↓
┌─────────────────────────────────────────────────────┐
│      @krisarmstrong/web-foundation Library          │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ Components │  │   Themes   │  │    Hooks     │  │
│  │ (UI/Layout)│  │  (Sage)    │  │(useTheme,etc)│  │
│  └────────────┘  └────────────┘  └──────────────┘  │
└───────────────────┬─────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────┐
│     External Services (Optional Integration)        │
│  Formspree (Contact) │ Google Analytics │ Sentry   │
└─────────────────────────────────────────────────────┘
```

### Architecture Layers

1. **Presentation Layer** - React components rendering UI
2. **Component Library Layer** - Shared components from web-foundation
3. **Theme Layer** - Intrinsic Momentum Mindset brand theme
4. **Routing Layer** - React Router for navigation
5. **Build Layer** - Vite bundler for optimization
6. **External Services Layer** - Form handling, analytics, error tracking

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.2.2 | Build tool & dev server |
| **React Router** | 7.9.6 | Client-side routing |
| **Tailwind CSS** | 4.1.17 | Utility-first styling |
| **@krisarmstrong/web-foundation** | 0.9.7 | Shared component library |

### Supporting Libraries

- **Lucide React** 0.553.0 - Icon library
- **@sentry/react** 10.25.0 - Error tracking (optional)
- **Formspree** - Contact form backend (external service)

### Development Tools

- **ESLint** 9.28.0 - Linting
- **PostCSS** 8.5.3 - CSS processing
- **TypeScript ESLint** 9.27.0 - TypeScript linting

---

## Directory Structure

```
intrinsicmomentummindset-com/
├── src/
│   ├── pages/                    # Page components (route handlers)
│   │   ├── Home.tsx              # Landing page (/)
│   │   ├── About.tsx             # About page (/about)
│   │   ├── Services.tsx          # Services page (/services)
│   │   ├── Contact.tsx           # Contact page (/contact)
│   │   ├── PrivacyPolicy.tsx     # Privacy policy (/privacy)
│   │   ├── TermsOfService.tsx    # Terms of service (/terms)
│   │   ├── NotFound.tsx          # 404 page
│   │   └── ErrorPage.tsx         # Error boundary page
│   ├── config/                   # Application configuration
│   │   └── navigation.tsx        # Navigation items, footer links, social links
│   ├── __tests__/                # Test files
│   │   └── smoke.test.tsx        # Basic smoke tests
│   ├── Layout.tsx                # Main layout wrapper component
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts             # Vite TypeScript declarations
├── public/                       # Static assets
├── .github/                      # GitHub configuration
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
├── dist/                         # Build output (generated)
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── postcss.config.cjs            # PostCSS configuration
├── README.md                     # Project overview
├── ARCHITECTURE.md               # This file
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript compiler configuration
├── tsconfig.app.json             # TypeScript app-specific config
├── tsconfig.node.json            # TypeScript Node.js config
└── vite.config.ts                # Vite build configuration
```

### Key Directories

- **`src/pages/`** - Contains all page-level components, one per route
- **`src/config/`** - Configuration files for navigation, footer, social links
- **`src/__tests__/`** - Test files (currently smoke tests, room for expansion)
- **`.github/workflows/`** - CI/CD pipeline configuration

---

## Component Architecture

### Component Hierarchy

```
App (main.tsx)
└── Router
    └── Layout.tsx (Shared layout wrapper)
        ├── Navbar (from web-foundation)
        ├── ThemeCanary (dev only, from web-foundation)
        ├── ThemeDiagnostics (dev only, from web-foundation)
        ├── PageShell (from web-foundation)
        │   └── <Outlet /> (Page components render here)
        │       ├── Home.tsx
        │       ├── About.tsx
        │       ├── Services.tsx
        │       ├── Contact.tsx
        │       ├── PrivacyPolicy.tsx
        │       ├── TermsOfService.tsx
        │       ├── NotFound.tsx
        │       └── ErrorPage.tsx
        └── Footer (from web-foundation)
```

### Component Categories

1. **Page Components** (`src/pages/`) - Top-level route handlers
   - Stateless functional components
   - Use web-foundation components for UI
   - Focused on content and layout

2. **Layout Component** (`src/Layout.tsx`) - Shared application structure
   - Wraps all pages
   - Provides consistent navigation and footer
   - Includes development-only diagnostics

3. **Configuration** (`src/config/`) - Application data
   - Navigation items
   - Footer links
   - Social media links

---

## Routing Strategy

### Routes

The application uses React Router 7 with the following routes:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home.tsx | Landing page with hero and philosophy |
| `/about` | About.tsx | About the coach and methodology |
| `/services` | Services.tsx | Coaching services and packages |
| `/contact` | Contact.tsx | Contact form |
| `/privacy` | PrivacyPolicy.tsx | Privacy policy |
| `/terms` | TermsOfService.tsx | Terms of service |
| `*` | NotFound.tsx | 404 page for invalid routes |

### Routing Configuration

```tsx
// main.tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout {...configProps} />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "services", element: <Services /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "terms", element: <TermsOfService /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

### Navigation Flow

1. User clicks a link or enters a URL
2. React Router matches the path to a route
3. Layout component renders with persistent navigation/footer
4. Page component renders in the `<Outlet />` slot
5. Suspense boundary shows loading state during code splitting

---

## Theme System

### Theme Integration

The application uses the **Intrinsic Momentum Mindset theme** from web-foundation:

```tsx
// main.tsx
import { ThemeProvider, intrinsicMomentumMindsetTheme } from '@krisarmstrong/web-foundation';

<ThemeProvider initialTheme={intrinsicMomentumMindsetTheme} initialMode="dark">
  <RouterProvider router={router} />
</ThemeProvider>
```

### Brand Colors (Sage Palette)

- **Primary**: Deep sage green (#2D4A3E)
- **Accent**: Warm sage/gold (#BFA968)
- **Surface Base**: Dark gray (#1A1A1A)
- **Surface Raised**: Slightly lighter gray (#242424)
- **Text Primary**: Light gray (#E5E5E5)
- **Text Muted**: Medium gray (#A0A0A0)
- **Text Accent**: Sage accent color

### Theme Application

1. **ThemeProvider** wraps the entire app in `main.tsx`
2. **CSS Custom Properties** are injected into `document.documentElement`
3. **Tailwind Utilities** reference theme tokens (e.g., `bg-surface-raised`, `text-text-accent`)
4. **Components** automatically inherit theme styling

### Development Theme Debugging

In development mode, two diagnostic tools are rendered:

- **ThemeCanary**: Visual indicator showing whether theme is applied
- **ThemeDiagnostics**: Detailed theme configuration display

---

## Build System

### Vite Configuration

**Build Tool**: Vite 7.2.2

**Key Features**:
- Hot Module Replacement (HMR) for fast development
- Optimized production builds with code splitting
- Asset optimization (images, fonts, etc.)
- TypeScript support out of the box

**Configuration** (`vite.config.ts`):
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### Build Process

```
Source Code (TypeScript + JSX)
           ↓
    ┌─────────────────┐
    │  Vite + esbuild │ → Fast transpilation
    └─────────────────┘
           ↓
    ┌─────────────────┐
    │  Code Splitting │ → Lazy loading
    └─────────────────┘
           ↓
    ┌─────────────────┐
    │ Tailwind Purge  │ → Remove unused CSS
    └─────────────────┘
           ↓
    ┌─────────────────┐
    │   Minification  │ → Optimize bundle size
    └─────────────────┘
           ↓
       dist/ folder
```

### Build Scripts

```json
{
  "dev": "vite",                    // Development server
  "build": "tsc && vite build",     // Production build
  "preview": "vite preview",        // Preview production build
  "lint": "eslint .",               // Run linter
  "test": "vitest run"              // Run tests
}
```

---

## Deployment

### Deployment Pipeline

**CI/CD Platform**: GitHub Actions

**Workflow** (`.github/workflows/ci.yml`):

```
Push to main/PR
     ↓
┌─────────────────┐
│   Install deps  │ (npm ci)
└─────────────────┘
     ↓
┌─────────────────┐
│   Lint & Type   │ (eslint + tsc)
└─────────────────┘
     ↓
┌─────────────────┐
│   Run Tests     │ (vitest)
└─────────────────┘
     ↓
┌─────────────────┐
│     Build       │ (npm run build)
└─────────────────┘
```

### Environment Variables

Required environment variables:

- **`VITE_FORM_ENDPOINT`** - Formspree endpoint for contact form (required)
- **`VITE_SENTRY_DSN`** - Sentry error tracking DSN (optional)

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
# Edit .env with your values
```

### Deployment Checklist

- [ ] Set `VITE_FORM_ENDPOINT` to valid Formspree endpoint
- [ ] Configure Sentry DSN (optional)
- [ ] Run `npm run build` to verify production build
- [ ] Test production build with `npm run preview`
- [ ] Deploy `dist/` folder to hosting provider

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - React Router lazy loading with `<Suspense>`
   - Each page is a separate chunk
   - Reduces initial bundle size

2. **Asset Optimization**
   - Images optimized and served from public/
   - Fonts preloaded
   - SVG icons from Lucide (tree-shakeable)

3. **CSS Optimization**
   - Tailwind CSS purge removes unused styles
   - Critical CSS inlined by Vite
   - Minified and compressed

4. **React Performance**
   - Functional components with hooks
   - No unnecessary re-renders (minimal state)
   - Memoization where needed

### Bundle Size

```
Estimated production bundle sizes:
- Vendor (React, Router, etc.): ~120KB gzipped
- Application code: ~30KB gzipped
- CSS (Tailwind + custom): ~10KB gzipped
- Total: ~160KB gzipped
```

### Performance Metrics (Target)

```
Lighthouse Scores (Target):
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100
```

---

## Design Patterns

### 1. **Layout Pattern**
Shared layout wrapper with `<Outlet />` for child routes

```tsx
<Layout>
  <Navbar />
  <PageShell>
    <Outlet /> {/* Page components render here */}
  </PageShell>
  <Footer />
</Layout>
```

### 2. **Configuration Pattern**
Centralized configuration in `src/config/navigation.tsx`

```tsx
export const navItems: NavItem[] = [ /* ... */ ];
export const footerLinks: FooterLinks = { /* ... */ };
export const socialLinks: SocialLink[] = [ /* ... */ ];
```

### 3. **Component Library Pattern**
Maximum reuse of web-foundation components

```tsx
import { ContactForm } from '@krisarmstrong/web-foundation';

<ContactForm
  endpoint={formEndpoint}
  tone="sage"
  // Custom configuration
/>
```

### 4. **Theme Provider Pattern**
Global theme context at root level

```tsx
<ThemeProvider initialTheme={intrinsicMomentumMindsetTheme}>
  <RouterProvider router={router} />
</ThemeProvider>
```

### 5. **Suspense Boundary Pattern**
Loading states for code-split routes

```tsx
<Suspense fallback={<LoadingPage message="Loading..." />}>
  <Outlet />
</Suspense>
```

---

## Security Architecture

### Security Considerations

1. **Form Submissions**
   - Contact form uses Formspree (external HTTPS endpoint)
   - Input sanitization handled by web-foundation ContactForm
   - No sensitive data stored client-side

2. **Environment Variables**
   - All sensitive keys in `.env` (not committed)
   - Only `VITE_*` variables exposed to client
   - Sentry DSN is public-safe

3. **Dependencies**
   - Regular `npm audit` checks
   - GitHub Dependabot enabled
   - Minimal dependencies (6 direct dependencies)

4. **Content Security Policy**
   - Should be configured at hosting provider level
   - See SECURITY.md for recommended CSP headers

---

## Future Architecture Considerations

### Planned Enhancements

1. **Analytics Integration**
   - Google Analytics or Plausible
   - Track page views, form submissions
   - Privacy-focused analytics

2. **Enhanced Testing**
   - Integration tests for routing
   - Component tests for pages
   - E2E tests with Playwright

3. **Accessibility Improvements**
   - Skip navigation links
   - Enhanced keyboard navigation
   - ARIA live regions for dynamic content

4. **Performance Monitoring**
   - Real User Monitoring (RUM) with Sentry
   - Core Web Vitals tracking
   - Performance budgets

---

## Appendix

### Key Metrics

| Metric | Value |
|--------|-------|
| Total Pages | 8 |
| Lines of Code | ~1,500 |
| Dependencies | 6 (direct) |
| Bundle Size (gzip) | ~160KB |
| Build Time | < 10s |
| Lighthouse Performance | 90+ (target) |

### Related Documentation

- [README.md](./README.md) - Project overview and setup
- [SECURITY.md](./SECURITY.md) - Security policy and guidelines
- [package.json](./package.json) - Dependencies and scripts

---

**Last Updated:** 2025-01-18
**Version:** 1.0.0
**Maintainer:** Kris Armstrong
