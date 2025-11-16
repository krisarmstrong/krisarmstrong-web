# @krisarmstrong/web-foundation

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green) ![Version](https://img.shields.io/badge/Version-0.9.0-blue) ![npm](https://img.shields.io/badge/npm-package-CB3837?logo=npm)

Shared layout primitives (PageShell, Footer, Breadcrumbs, PrimaryNav, UI tokens) for Wi-Fi Vigilante, krisarmstrong-portfolio, and future sites. It now includes the base UI kit (Button, Card, Typography, PageHeader) so every property gets identical navigation, hero headings, and call-to-action styling out of the box. The package is framework-agnostic outside of React + React Router and ships compiled ESM/CJS bundles plus TypeScript definitions out of `dist/`.

## Local development workflow

1. Make edits inside `src/`.
2. (Optional during development) run `npm run dev` here to watch/build into `dist/` with `tsup`.
3. Point each consuming project at the local folder: `npm install ../web-foundation` (already done via `file:../web-foundation`).

Both Wi-Fi Vigilante and the portfolio currently reference the package via `file:../web-foundation`, which means your CI/CD job must place the shared package next to each repo (monorepo checkout, git submodule, or npm registry publish).

## Publishing

When you’re ready to cut a release:

```bash
npm install            # installs dev deps for the build tooling
npm version patch
npm publish --access public
```

After publishing, update each consumer’s `package.json` to reference the semantic version instead of the local `file:` path, then reinstall dependencies. This guarantees production builds (Netlify, Vercel, etc.) can resolve the shared UI without needing the monorepo structure.

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
  <NavCard theme="light" to="/services" title="Services" description="Grounded, intentional coaching." icon={<Star />} />
</PageShell>
```

You can also wrap apps in the provided `ThemeProvider` to drive colors via CSS variables rather than passing `theme` everywhere.

See each site’s `src/config/navigation.ts` for examples of how to feed nav data into `PrimaryNav`.
