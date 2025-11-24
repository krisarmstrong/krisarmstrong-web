# Kris Armstrong Web - Professional Monorepo Architecture

A production-ready monorepo for building modern React applications with a shared component library, proper theming, and professional best practices.

## Architecture Overview

This project uses a monorepo structure to share code between multiple applications while maintaining clear boundaries and reusability.

```
krisarmstrong-web/
├── apps/
│   ├── intrinsic/              # Intrinsic Momentum Mindset website
│   ├── krisarmstrong/          # Kris Armstrong personal portfolio
│   └── wifivigilante/          # Wi-Fi Vigilante case library
├── packages/
│   └── web-foundation/         # Shared UI component library
└── package.json                # Workspace configuration
```

### Key Features

- **🎨 Professional Theming System** - Dark/light mode with localStorage persistence
- **📦 Monorepo Architecture** - npm workspaces + Turbo for efficient builds
- **⚡ Performance Optimized** - Code splitting, lazy loading, and tree-shaking
- **🔒 Type-Safe** - Full TypeScript coverage with strict typing
- **🎯 Modern Stack** - React 18, Vite, Tailwind CSS v4, React Router v7
- **🧪 Testing Ready** - Vitest, Testing Library, Playwright configured
- **📊 Monitoring** - Sentry integration for error tracking

---

## Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide for local development and Vercel deployment
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines, commit conventions, and workflow
- **[TESTING.md](./TESTING.md)** - Testing patterns, best practices, and examples
- **[apps/intrinsic/README.md](./apps/intrinsic/README.md)** - Intrinsic app documentation
- **[apps/krisarmstrong/README.md](./apps/krisarmstrong/README.md)** - Kris Armstrong portfolio documentation
- **[apps/wifivigilante/README.md](./apps/wifivigilante/README.md)** - Wi-Fi Vigilante documentation
- **[packages/web-foundation/README.md](./packages/web-foundation/README.md)** - Component library documentation

---

## Getting Started

See [SETUP.md](./SETUP.md) for complete setup instructions.

### Quick Start (Root)

```bash
# Clone the repository
git clone <your-repo-url>
cd krisarmstrong-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### App Quickstart Cheatsheet

- `apps/intrinsic` — `npm run dev --workspace intrinsic` (port 3001)
- `apps/krisarmstrong` — `npm run dev --workspace krisarmstrong` (port 5173)
- `apps/wifivigilante` — `npm run dev --workspace wifivigilante` (port 3002)

> First run: `npx playwright install --with-deps` if you plan to run e2e tests.

### Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0

---

## Project Structure

### Apps

#### `/apps/intrinsic`

The Intrinsic Momentum Mindset coaching website. This demonstrates how to build an app using the shared component library.

**Key Features:**

- Sage/earth tone theme (light & dark modes)
- Responsive navigation with mobile menu
- Contact form with validation
- SEO-optimized pages
- Lazy-loaded routes

**Scripts:**

```bash
cd apps/intrinsic
npm run dev          # Start dev server (port 3001)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests (46 tests)
npm run lint         # Lint code
```

#### `/apps/krisarmstrong`

Personal portfolio and technical blog for Kris Armstrong (CISSP | CWSP | CWDP | CWNA).

**Key Features:**

- Violet theme with professional styling
- Technical blog with Supabase integration
- Resume with multiple export formats (PDF, Word, Markdown)
- Skills and projects showcase
- Progressive content loading
- Full-text search

**Scripts:**

```bash
cd apps/krisarmstrong
npm run dev          # Start dev server
npm run build        # Production build (includes blog metadata & sitemap)
npm run preview      # Preview production build
npm run test         # Run tests (42 tests)
npm run lint         # Lint code
```

#### `/apps/wifivigilante`

Wi-Fi security case library showcasing real-world wireless network investigations.

**Key Features:**

- Blue theme with cybersecurity aesthetics
- Case display with filtering and search
- PDF export functionality
- Rate limiting and security features
- Integration with case management system

**Scripts:**

```bash
cd apps/wifivigilante
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests (40 tests)
npm run lint         # Lint code
```

### Packages

#### `/packages/web-foundation`

Reusable UI component library following professional React patterns.

**Components:**

- **Primitives:** Button, Card, Input, Typography
- **Composed:** Navbar, Footer, ContactForm
- **Utilities:** ThemeProvider, ErrorBoundary, hooks

**Key Principles:**

- ✅ Theme-aware (uses CSS variables)
- ✅ Fully typed with TypeScript
- ✅ Accessible (ARIA attributes)
- ✅ Tested (unit + integration)
- ✅ Documented (JSDoc comments)

---

## Theming System

### How It Works

The theming system uses a hybrid approach combining React Context for state management and CSS variables for styling.

```tsx
// Theme is applied via ThemeProvider at app root
<ThemeProvider initialTheme={intrinsicTheme} initialMode="auto">
  <App />
</ThemeProvider>
```

### Theme Structure

Themes define colors for:

- **Brand**: Primary and accent colors
- **Surface**: Backgrounds, borders, hover states
- **Text**: Primary, muted, accent, inverse
- **Interactive**: Button states (default, hover, active, focus, disabled)
- **Status**: Success, warning, error, info

### Creating Custom Themes

```typescript
import { ThemeConfig } from '@krisarmstrong/web-foundation';

export const myCustomTheme: ThemeConfig = {
  brand: {
    primary: '#your-primary-color',
    accent: '#your-accent-color',
  },
  surface: {
    base: '#your-background',
    raised: '#your-card-bg',
    border: '#your-border',
    hover: '#your-hover',
  },
  text: {
    primary: '#your-text',
    muted: '#your-muted-text',
    accent: '#your-accent-text',
    inverse: '#your-inverse-text',
  },
  interactive: {
    default: '#button-default',
    hover: '#button-hover',
    active: '#button-active',
    focus: '#button-focus',
    disabled: '#button-disabled',
  },
  status: {
    success: '#success-color',
    warning: '#warning-color',
    error: '#error-color',
    info: '#info-color',
  },
};
```

### Dark/Light Mode

The theme system automatically handles dark/light mode switching:

```tsx
import { useTheme } from '@krisarmstrong/web-foundation';

function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const cycleMode = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('auto');
    else setMode('light');
  };

  return <button onClick={cycleMode}>Toggle Theme</button>;
}
```

**Modes:**

- `light` - Always light theme
- `dark` - Always dark theme
- `auto` - Follows system preference (default)

**Persistence:**

- Mode and theme are automatically saved to localStorage
- Restored on page reload
- Survives browser restarts

---

## Component Usage

### Button

```tsx
import { Button } from '@krisarmstrong/web-foundation';

// Primary button
<Button variant="primary">Click me</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Danger button with icon
<Button variant="danger" leftIcon={<TrashIcon />}>
  Delete
</Button>

// Loading state
<Button isLoading>Saving...</Button>

// Button as link
<Button as="Link" to="/about">Go to About</Button>

// Button as anchor
<Button as="a" href="https://example.com" target="_blank">
  External Link
</Button>
```

**Variants:** `primary`, `secondary`, `danger`, `warning`, `success`, `outline`, `ghost`

### Typography

```tsx
import { H1, H2, P, SmallText, Badge, Tag } from '@krisarmstrong/web-foundation';

// Headings
<H1>Page Title</H1>
<H2>Section Title</H2>

// Paragraphs
<P>Regular paragraph text</P>
<P color="primary" size="sm">Small primary text</P>

// Small text
<SmallText>Muted small text</SmallText>

// Badges and Tags
<Badge variant="success">New</Badge>
<Tag colorScheme="primary">Featured</Tag>
```

### Card

```tsx
import { Card } from '@krisarmstrong/web-foundation';

<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>;
```

### Forms

```tsx
import { Input, ContactForm } from '@krisarmstrong/web-foundation';

// Input component
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  required
  error={errors.email}
/>

// Full contact form
<ContactForm
  endpoint="/api/contact"
  onSuccess={() => console.log('Sent!')}
/>
```

---

## Adding a New App

To create a new app in this monorepo:

```bash
# 1. Create app directory
mkdir -p apps/my-new-app

# 2. Initialize package
cd apps/my-new-app
npm init -y

# 3. Install dependencies
npm install react react-dom react-router-dom @krisarmstrong/web-foundation

# 4. Copy configuration from intrinsic
cp ../intrinsic/vite.config.ts .
cp ../intrinsic/tsconfig.json .
cp ../intrinsic/tailwind.config.js .

# 5. Create src directory and basic structure
mkdir src
touch src/main.tsx src/App.tsx src/index.css

# 6. Add to workspace (if not auto-detected)
# Edit root package.json workspaces array
```

**Minimal App Setup:**

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, intrinsicTheme } from '@krisarmstrong/web-foundation';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider initialTheme={intrinsicTheme} initialMode="auto">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

```tsx
// src/App.tsx
import { Button, H1, P } from '@krisarmstrong/web-foundation';

export default function App() {
  return (
    <main className="min-h-screen bg-surface-base text-text-primary p-8">
      <H1>My New App</H1>
      <P>Built with the shared component library!</P>
      <Button variant="primary">Get Started</Button>
    </main>
  );
}
```

```css
/* src/index.css */
@import 'tailwindcss';

body {
  background-color: var(--color-surface-base);
  color: var(--color-text-primary);
}
```

---

## Best Practices

### TypeScript

- ✅ Use strict mode
- ✅ Avoid `any` - use `unknown` if needed
- ✅ Use proper prop types (not `[key: string]: unknown`)
- ✅ Leverage type inference where possible
- ✅ Create reusable type utilities

### Components

- ✅ Keep components small and focused (< 200 lines)
- ✅ Use composition over prop-drilling
- ✅ Implement proper loading/error states
- ✅ Add accessibility attributes (ARIA)
- ✅ Document props with JSDoc

### Performance

- ✅ Use React.lazy() for route components
- ✅ Implement proper code splitting
- ✅ Memoize expensive calculations with useMemo
- ✅ Optimize re-renders with useCallback, React.memo
- ✅ Lazy load images

### Testing

- ✅ Test user interactions, not implementation
- ✅ Use Testing Library queries by priority
- ✅ Mock API calls properly
- ✅ Test accessibility
- ✅ Aim for >80% coverage on critical paths

---

## Build Optimization

The build is optimized for production with:

- **Code Splitting** - Vendor chunks separated (React, UI, Sentry)
- **Tree Shaking** - Unused code eliminated
- **Minification** - Terser with console removal
- **Modern Target** - ES2020+ for smaller bundles
- **Source Maps** - Enabled for production debugging

```bash
# Analyze bundle size
npm run build
ls -lh apps/intrinsic/dist/assets/
```

**Bundle Breakdown:**

- `vendor-react.js` - React, ReactDOM, React Router (~60KB gzipped)
- `vendor-ui.js` - Lucide icons, web-foundation (~30KB gzipped)
- `vendor-sentry.js` - Error tracking (~20KB gzipped, lazy loaded)
- Page chunks - Individual routes (~2-5KB each)

---

## Environment Variables

Create `.env` files for environment-specific configuration:

```bash
# .env.local (not committed to git)
VITE_SENTRY_DSN=your-sentry-dsn
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

---

## Deployment

### Build for Production

```bash
# Build all packages and apps
npm run build

# The output will be in:
# - apps/intrinsic/dist
# - packages/web-foundation/dist
```

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `apps/intrinsic/dist`
4. Add environment variables
5. Deploy!

### Deploy to VPS

```bash
# Build locally or in CI
npm run build

# Copy dist folder to server
scp -r apps/intrinsic/dist/* user@server:/var/www/html/

# Or use Docker
docker build -t my-app .
docker run -p 80:80 my-app
```

---

## Troubleshooting

### Build Errors

**Error:** `Cannot find module '@krisarmstrong/web-foundation'`

```bash
# Solution: Build the package first
cd packages/web-foundation
npm run build
cd ../..
```

**Error:** `Dependency version mismatch`

```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
npm install
```

### Theme Not Working

**Issue:** Theme doesn't change or persist

- ✅ Verify ThemeProvider wraps your app
- ✅ Check localStorage is enabled
- ✅ Inspect CSS variables in DevTools
- ✅ Ensure components use theme-aware classes

### TypeScript Errors

**Error:** Property 'foo' does not exist

```bash
# Solution: Rebuild types
cd packages/web-foundation
npm run build
```

---

## Contributing

### Code Style

- Use Prettier for formatting (configured in web-foundation)
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features

### Pull Request Process

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make your changes
3. Run tests (`npm test`)
4. Run linter (`npm run lint`)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## Versioning & Releases

This project uses **[semantic-release](https://semantic-release.gitbook.io/)** for automated versioning and releases. Version numbers are determined automatically based on commit messages using the **[Conventional Commits](https://www.conventionalcommits.org/)** specification.

### Semantic Versioning

We follow [SemVer](https://semver.org/) strictly:

- **MAJOR** version (1.0.0 → 2.0.0): Breaking changes
- **MINOR** version (1.3.0 → 1.4.0): New features (backwards compatible)
- **PATCH** version (1.3.1 → 1.3.2): Bug fixes

### Conventional Commits Format

All commits must follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Common Types:**

| Type                           | Version Bump              | Use Case         | Example                              |
| ------------------------------ | ------------------------- | ---------------- | ------------------------------------ |
| `fix:`                         | **PATCH** (1.3.1 → 1.3.2) | Bug fixes        | `fix: resolve PostCSS import errors` |
| `feat:`                        | **MINOR** (1.3.0 → 1.4.0) | New features     | `feat: add dark mode toggle`         |
| `feat!:` or `BREAKING CHANGE:` | **MAJOR** (1.0.0 → 2.0.0) | Breaking changes | `feat!: migrate to React 19`         |
| `chore:`                       | No bump                   | Maintenance      | `chore: update dependencies`         |
| `docs:`                        | No bump                   | Documentation    | `docs: update README`                |
| `style:`                       | No bump                   | Code style       | `style: fix linting issues`          |
| `refactor:`                    | No bump                   | Code refactoring | `refactor: simplify theme logic`     |
| `test:`                        | No bump                   | Tests            | `test: add ContactForm tests`        |
| `perf:`                        | **PATCH**                 | Performance      | `perf: optimize bundle size`         |

**Examples:**

```bash
# Bug fix (patch: 1.3.1 → 1.3.2)
git commit -m "fix: resolve font loading issue in Safari"

# New feature (minor: 1.3.0 → 1.4.0)
git commit -m "feat: add export to Excel functionality"

# Breaking change (major: 1.0.0 → 2.0.0)
git commit -m "feat!: migrate to Tailwind v4

BREAKING CHANGE: Requires Tailwind CSS v4. Update config files."

# With scope
git commit -m "fix(theme): correct dark mode color contrast"

# No version bump
git commit -m "chore: update npm dependencies"
git commit -m "docs: improve setup instructions"
```

### Release Process

#### Automated Release (Recommended)

Simply push commits following conventional format:

```bash
# 1. Make changes and commit with conventional format
git commit -m "feat: add user preferences panel"

# 2. Push to main
git push origin main

# 3. Semantic-release automatically:
#    - Analyzes commits
#    - Determines version bump
#    - Updates package.json
#    - Generates CHANGELOG.md
#    - Creates git tag
#    - Pushes changes
#    - Creates GitHub release
```

#### Manual Release

For manual control or testing:

```bash
# Test what would be released (dry run - no changes made)
npm run release:dry

# Manually trigger release
npm run release
```

### What Semantic-Release Does

When you run `npm run release`, it automatically:

1. ✅ **Analyzes** all commits since last release
2. ✅ **Determines** version bump (patch/minor/major)
3. ✅ **Updates** `package.json` version
4. ✅ **Generates** `CHANGELOG.md` with all changes
5. ✅ **Creates** git tag (e.g., `v1.3.2`)
6. ✅ **Commits** the version changes
7. ✅ **Pushes** to GitHub
8. ✅ **Creates** GitHub Release with notes

### Commit Message Best Practices

**DO:**

- ✅ Use lowercase for type (`feat:` not `Feat:`)
- ✅ Be concise but descriptive (max 72 chars for subject)
- ✅ Use imperative mood ("add" not "added" or "adds")
- ✅ Include scope when relevant: `fix(theme):`, `feat(ui):`
- ✅ Add body for context on complex changes

**DON'T:**

- ❌ Mix multiple changes in one commit
- ❌ Use vague messages ("fixes", "updates")
- ❌ Skip the type prefix
- ❌ Include issue numbers in subject (put in body/footer)

**Good Examples:**

```bash
feat(auth): add OAuth login support
fix(navbar): resolve mobile menu z-index issue
perf(images): implement lazy loading for blog images
```

**Bad Examples:**

```bash
Fixed stuff                           # Missing type, too vague
feat: Added new feature and fixed bug # Multiple changes
Update dependencies                   # Missing type
```

### Version History

Version history is automatically maintained in `CHANGELOG.md`. Each release includes:

- Version number and date
- Grouped changes by type (Features, Bug Fixes, etc.)
- Commit links to GitHub

---

## Architecture Decisions

### Why Monorepo?

- **Code Sharing**: Reuse components across multiple apps
- **Atomic Changes**: Update library and apps together
- **Type Safety**: TypeScript across boundaries
- **Faster Iteration**: No need to publish packages

### Why npm Workspaces + Turbo?

- **Native**: Built into npm, no extra tools
- **Fast**: Turbo provides intelligent caching
- **Simple**: Easy to understand and maintain

### Why Tailwind CSS v4?

- **Performance**: Faster builds with new engine
- **CSS-first**: Better control over theming
- **Modern**: Takes advantage of new CSS features

### Why React Context for Theming?

- **Runtime Switching**: Change themes without reload
- **Persistence**: Save preferences to localStorage
- **Simple**: No complex state management needed

---

## License

MIT - See LICENSE file

---

## Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Contact: [your-email@example.com]

---

## Changelog

### v1.0.0 (2025-11-19)

**✨ Initial Release**

- 🎨 Professional theming system with dark/light modes
- 📦 Monorepo architecture with npm workspaces
- ⚡ Optimized build configuration with code splitting
- 🔒 Type-safe component library
- 🧪 Testing infrastructure with Vitest
- 📊 Sentry integration for monitoring
- 🎯 React 18, Vite 7, Tailwind v4, React Router v7

**🔧 Architecture Improvements**

- Removed unused dependencies (framer-motion, tailwind-variants)
- Stabilized to React 18.3.x
- Fixed TypeScript anti-patterns (no more `[key: string]: unknown`)
- Implemented proper polymorphic component types
- Added comprehensive bundle optimization
- Theme-aware components using CSS variables

**📝 Documentation**

- Comprehensive README with examples
- Architecture decision documentation
- Component usage guidelines
- Deployment instructions
