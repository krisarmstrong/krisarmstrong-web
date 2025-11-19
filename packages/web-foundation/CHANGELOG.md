# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2025-11-16

### Fixed
- **CRITICAL**: Fixed React import location in ThemeContext.tsx - now properly imports useState and useEffect at top of file
- **HIGH**: Fixed hook performance issues in useClickOutside and useEscapeKey - now use useRef to prevent unnecessary re-renders
- **HIGH**: Removed CommonJS require() usage - replaced with shared ESM utility functions
- **HIGH**: Deduplicated isDevelopmentEnvironment and getSentry code into shared utils/env.ts module
- **MEDIUM**: Added missing accessibility attributes:
  - Footer separators now have aria-hidden="true"
  - Button loading states now have aria-busy and screen reader text
  - LoadingSpinner now has role="status", aria-live, and screen reader text
- **DOCS**: Removed false Storybook claims from README (Storybook not yet implemented)

### Added
- LICENSE file (MIT License)
- Shared utils/env.ts module for environment detection and Sentry access
- Comprehensive accessibility improvements across components

### Changed
- package.json now includes LICENSE and README.md in published files

## [0.9.0] - 2025-11-15

### Added
- ContactForm component with spam protection, offline messaging, and tone/background theming
- Three complete theme configurations for wifivigilante.com, krisarmstrong.org, and intrinsicmomentummindset.com
- Comprehensive component library including:
  - Navigation: Navbar, PrimaryNav, Breadcrumbs, SiteSearch
  - Layout: PageShell, PageHeader, Section, Footer
  - UI Components: Button, Card, Input, Typography, List, Avatar
  - Content: ContentCard, ServiceCard, NavCard, StarRating
  - State: Loading components, Error boundaries, EmptyState
  - Forms: ContactForm with telemetry
  - Utilities: useClickOutside, useEscapeKey, useBodyScrollLock, useProgressiveLoad, useTelemetry
- Social icons for GitHub, LinkedIn, X (Twitter), YouTube, Facebook, Instagram
- Theme context with light/dark mode support

### Changed
- Button gained an `emerald` tone for WiFi Vigilante branding
- Sage theme optimized for Intrinsic Momentum Mindset's earth tones

### Added
- Theme-aware tokens (`themeTokens`) and optional `theme` props across layout primitives (PageShell, Footer, Breadcrumbs, NavCard, Card, PageHeader) so components render correctly in both dark and light palettes out of the box.
- New `sage` tone for primary buttons, plus typography defaults that now read from CSS variables, allowing ThemeProvider overrides without manual class overrides.

### Changed
- Footer, Breadcrumbs, PageShell, NavCard, and Card now rely on CSS variables/inline styles derived from theme tokens instead of baked-in gray backgrounds, enabling Intrinsic Momentum Mindset and other light-brand sites to consume the shared UI kit without hand-patching styles.

## [0.7.1] - 2025-01-14

### Changed
- **Repository renamed** for clarity
  - GitHub repo: `site-shell` → `web-foundation`
  - Package name remains `@krisarmstrong/web-foundation`
  - Better alignment with package naming

## [0.7.0] - 2025-01-14

### Added
- **ActiveFilterBadges** component for displaying active filters
  - Shows removable filter badges with accent color theming
  - Displays result count and "Clear all" option
  - Supports multiple filters with individual remove actions
- **LoadMoreButton** component for progressive loading
  - Shows remaining count and items to load
  - Primary and secondary variants
  - Accent color theming
- **EmptyState** component for no results/empty data
  - Customizable icon, title, description
  - Optional action button
  - Configurable minimum height
- **useProgressiveLoad** hook for managing progressive item loading
  - Automatic reset on items change
  - Returns visible items, remaining count, load more function
  - Configurable items per load

### Fixed
- **ContentSort** dropdown now shows selected value correctly
  - Removed problematic inline styles causing white box
  - Text now visible before and after selection

## [0.6.1] - 2025-01-14

### Fixed
- **CRITICAL SECURITY**: Removed unsafe `new Function()` constructor from Error.tsx
  - Replaced eval-like pattern with safe import.meta.env check
  - Eliminates code injection vulnerability
- **ContentSort** dropdown text now visible before clicking
  - Added custom dropdown arrow with white color
  - Improved option styling with explicit background/text colors
  - Better UX with visible select text

### Changed
- Improved environment detection in Error component
  - Now safely checks both Vite (import.meta.env) and webpack (process.env)
  - Falls back gracefully when import.meta is unavailable

## [0.6.0] - 2025-01-14

### Added
- **ContentSearch** component for instant client-side content filtering
  - Debounced search with customizable delay
  - Multi-field search support
  - Result count display
  - Clear button
  - Accent color theming
- **ContentSort** component for reusable sort dropdowns
  - Flexible sort options
  - Icon support
  - Accent color theming
  - Consistent styling with ContentSearch

### Changed
- Package version bumped to 0.6.0

## [0.5.0] - 2025-01-14

### Added
- Initial ContentSearch implementation
- Export ContentSearch types

### Changed
- Package version bumped to 0.5.0

## [0.4.0] - Prior releases

See git history for earlier changes.
