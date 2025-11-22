# Architecture Documentation

## Project Overview

This is a monorepo containing 3 production websites and a shared component library, all built with React 19, Vite, and Tailwind CSS 4.x.

## Monorepo Structure

```
krisarmstrong-web/
├── apps/
│   ├── wifivigilante/      # WiFi Vigilante - Security case studies
│   ├── intrinsic/          # Intrinsic Momentum Mindset - Wellness coaching
│   └── krisarmstrong/      # Personal portfolio with blog
├── packages/
│   └── web-foundation/     # Shared React components and utilities
├── e2e/                    # Playwright E2E tests
└── [config files]
```

## Technology Stack

### Core Framework
- **React 19.2.0** - Latest React with concurrent features
- **TypeScript 5.x** - Type-safe development
- **Vite 7.2.4** - Lightning-fast build tool
- **Tailwind CSS 4.x** - Utility-first CSS framework

### Routing & State
- **React Router 7.x** - Client-side routing
- **ThemeContext** - Centralized theme management

### Testing
- **Vitest** - Unit and integration testing
- **@testing-library/react** - Component testing
- **Playwright** - E2E testing across all apps

### Build & Deploy
- **Turbo** - Monorepo build orchestration
- **npm workspaces** - Dependency management
- **Husky** - Git hooks
- **Semantic Release** - Automated versioning

## Application Details

### 1. WiFi Vigilante (`wifivigilante-com`)
**Purpose:** Showcase WiFi security case studies and threat analysis

**Key Features:**
- Interactive case database with search and filtering
- Case of the Day feature
- PDF generation for case reports
- Dark/light theme with blue color scheme

**Tech Highlights:**
- Advanced search with debouncing
- HTML2Canvas for PDF generation
- Rate limiting utilities
- Sentry error tracking

### 2. Intrinsic Momentum Mindset (`intrinsicmomentummindset-com`)
**Purpose:** Wellness coaching and services platform

**Key Features:**
- Service catalog
- Contact forms with validation
- Earth-toned sage/green theme
- Minimal, calming design

**Tech Highlights:**
- Form validation utilities
- Responsive layouts
- Accessibility-first components

### 3. Kris Armstrong (`krisarmstrong-org`)
**Purpose:** Personal portfolio, blog, and professional resume

**Key Features:**
- Blog with 59+ posts and metadata generation
- Sitemap generation
- Downloadable PDF resume
- Projects showcase
- Skills visualization

**Tech Highlights:**
- Markdown blog posts with frontmatter
- Supabase integration for blog views/likes
- Dynamic sitemap generation
- Professional teal theme

## Shared Component Library

### `@krisarmstrong/web-foundation`

**Core Components:**
- `Navbar` - Responsive navigation with mobile menu
- `Footer` - Consistent site footer
- `ContactForm` - Validated contact forms
- `ThemeProvider` - Theme context and switching
- `Button`, `Card`, `Badge` - UI primitives
- `ErrorBoundary` - Error handling wrapper
- `PageShell` - Layout container
- `SiteSearch` - Search functionality
- `Loading` - Loading states with animations

**Utilities:**
- Form validation (`validation.ts`)
- Web vitals reporting
- Error tracking setup
- Theme tokens and design system

**Styling:**
- CSS custom properties for theming
- Tailwind utility classes
- Shared base styles
- Typography system

## CSS Theming Architecture

### Three-Layer System

1. **@theme Blocks (Build-time)**
   - Located in each app's `index.css`
   - Generates Tailwind utility classes
   - Provides initial CSS custom properties
   - Processed during build by Tailwind

2. **ThemeContext (Runtime)**
   - TypeScript theme definitions
   - Dynamic theme switching (light/dark)
   - Sets CSS variables via JavaScript
   - Persists user preferences to localStorage

3. **tokens.ts (Fallback Chain)**
   - Shared design tokens
   - Multi-level fallback: `var(--theme-*, var(--color-*, #fallback))`
   - Used in component styles for safety

### Theme Synchronization

All three layers maintain identical color values for consistency. Each theme includes:
- Brand colors (primary, accent)
- Surface colors (base, raised, border, hover)
- Text colors (primary, muted, accent, inverse)
- Interactive states (default, hover, active, focus, disabled)
- Status colors (success, warning, error, info)

**Example:**
```css
/* apps/wifivigilante/src/index.css */
@theme {
  --color-brand-primary: #2563eb;  /* Blue */
}
```

```typescript
// packages/web-foundation/src/context/ThemeContext.tsx
export const wifiVigilanteTheme = {
  brand: { primary: '#2563eb' }  // Same value
}
```

```typescript
// packages/web-foundation/src/tokens.ts
export const colorTokens = {
  brand: {
    primary: 'var(--theme-brand-primary, var(--color-brand-primary, #2563eb))'
  }
}
```

## Build System

### Turbo Configuration
- Parallel builds across workspaces
- Intelligent caching
- Task dependencies

### Build Order
1. `web-foundation` package (shared components)
2. All apps in parallel (once foundation is built)

### Scripts
```json
{
  "dev": "Start all dev servers",
  "build": "Build all apps and packages",
  "test": "Run all unit tests",
  "test:e2e": "Run Playwright E2E tests",
  "lint": "ESLint all workspaces",
  "format": "Prettier code formatting"
}
```

## Testing Strategy

### Unit Tests (Vitest)
- Component rendering
- User interactions
- Utility functions
- Error handling

**Coverage:**
- WiFi Vigilante: 37 tests
- Intrinsic: 46 tests
- Kris Armstrong: 42 tests
- Foundation: 13 tests
- **Total: 138 unit tests**

### E2E Tests (Playwright)
- Cross-browser testing (Chromium)
- Full user journeys
- Navigation flows
- Theme switching
- Form submissions

**Test Suites:**
- WiFi Vigilante: Homepage, cases, navigation, contact
- Intrinsic: Homepage, services, about, contact
- Kris Armstrong: Homepage, blog, projects, resume

## Error Handling

### Sentry Integration
- Automatic error tracking
- Performance monitoring
- Release tracking
- Source maps for debugging

### Error Boundaries
- Graceful error UI
- Error logging
- Fallback content
- Recovery options

## Performance Optimizations

### Code Splitting
- React.lazy() for route-based splitting
- Suspense boundaries with loading states
- Vendor chunk splitting (React, UI libs, Sentry)

### Asset Optimization
- Image lazy loading
- CSS purging (unused styles removed)
- Gzip compression
- Bundle size monitoring

### Caching
- Build cache via Turbo
- Browser caching headers
- Service worker (future)

## Deployment

### Build Artifacts
Each app produces:
- `dist/index.html` - Entry point
- `dist/assets/` - Chunked JS and CSS
- Source maps for debugging

### Environment Variables
- Managed per app
- Sentry DSN
- API endpoints
- Feature flags

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- Feature branches for development
- PR-based reviews

### Commit Convention
- Conventional Commits (Commitlint)
- Semantic versioning
- Automated changelogs

### CI/CD
- Husky pre-commit hooks
- ESLint + Prettier checks
- Unit tests on commit
- Semantic Release for versioning

## Future Improvements

### Planned Enhancements
1. **CSS Simplification**
   - Migrate to single source of truth (@theme + data attributes)
   - Remove redundant ThemeContext CSS var setting
   - Reduce maintenance burden

2. **Testing**
   - Increase E2E test coverage
   - Visual regression testing
   - Accessibility audits

3. **Performance**
   - Service worker for offline support
   - Image optimization pipeline
   - Bundle analyzer integration

4. **Developer Experience**
   - Storybook for component documentation
   - Better TypeScript strictness
   - Component prop documentation

## Contact

For questions or contributions, contact Kris Armstrong.

---

*Last updated: 2025-11-22*
*Architecture maintained by: Kris Armstrong*
