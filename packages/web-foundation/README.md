# @krisarmstrong/web-foundation

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green) ![Version](https://img.shields.io/badge/Version-0.9.11-blue) ![npm](https://img.shields.io/badge/npm-package-CB3837?logo=npm)

Shared UI component library for the krisarmstrong-web monorepo. Provides layout primitives (PageShell, Footer, Breadcrumbs, PrimaryNav), UI components (Button, Card, Typography, PageHeader), and theming utilities for consistent design across all applications.

## Overview

This package provides:

- **Layout Components** - PageShell, Navbar, Footer, Breadcrumbs
- **UI Primitives** - Button, Card, Input, Typography
- **Theming System** - ThemeProvider with dark/light mode support
- **Utilities** - Error boundaries, hooks, type utilities
- **Tokens** - Design tokens for spacing, colors, and typography

Built for monorepo use with React 19, TypeScript, and Tailwind CSS v4.

## Monorepo Development

This package is designed to be used within the krisarmstrong-web monorepo via npm workspaces.

### Making Changes

1. Edit files in `src/`
2. Build the package:
   ```bash
   npm run build
   ```
3. Consuming apps will automatically pick up changes via workspace linking

### Build Output

The build process generates:

- ESM and CJS bundles
- TypeScript type definitions
- Source maps for debugging

```bash
packages/web-foundation/
├── dist/
│   ├── index.js          # ESM bundle
│   ├── index.cjs         # CommonJS bundle
│   ├── index.d.ts        # TypeScript definitions
│   └── *.map             # Source maps
```

## Publishing (Optional)

To publish to npm registry for use outside the monorepo:

```bash
# Ensure you're logged in to npm
npm login

# Update version and publish
npm version patch       # or minor/major
npm publish --access public
```

After publishing, external projects can install via:

```bash
npm install @krisarmstrong/web-foundation
```

## Available components

- `PageShell` – consistent max-width layout, skip link, breadcrumb slot.
- `Footer` – social + legal links. Pass `theme="light"` for lighter sites.
- `Breadcrumbs` – accessible breadcrumb trail that respects light/dark palettes.
- `PrimaryNav` – shared desktop/mobile navigation pills fed by each site’s `PRIMARY_NAV`.
- `Button` – tone-aware CTA with loading state (pass `tone="violet"` for portfolio branding).
- `Card` / `CardContent` – surfaced for dashboards and project grids.
- `Typography` helpers – `H1`, `H2`, `ArticleTitle`, `P`, `MutedText`, `Tag`, `AccentLink`, etc.
- `PageHeader` – icon + subtitle hero block used on the portfolio detail pages.
- `ContactForm` – themable contact capture with honeypot + offline notice logic plus shared privacy copy.
- `tokens` – spacing/color primitives you can override with CSS variables.

### Light vs Dark usage

Every layout primitive now accepts an optional `theme` prop (`'dark' | 'light'`) and references the shared `themeTokens`, so mixing brands is straightforward:

```tsx
<PageShell theme="light">
  <PageHeader
    theme="light"
    icon={Sparkles}
    title="Intrinsic Momentum Mindset"
    description="Guided coaching with sage & gold accents."
  />
  <NavCard
    theme="light"
    to="/services"
    title="Services"
    description="Grounded, intentional coaching."
    icon={<Star />}
  />
</PageShell>
```

You can also wrap apps in the provided `ThemeProvider` to drive colors via CSS variables rather than passing `theme` everywhere.

See each site’s `src/config/navigation.ts` for examples of how to feed nav data into `PrimaryNav`.
