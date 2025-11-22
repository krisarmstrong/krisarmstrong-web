# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Synchronized CSS theme values across all layers (@theme, ThemeContext, tokens.ts)
- Updated dark theme focus color: #93c5fd → #2563eb for consistency
- Updated light theme focus color: #1e40af → #3b82f6 for consistency
- Reduced navbar height: Shield icon 28px → 24px, removed lg:text-2xl text scaling
- Fixed main.tsx to use wifiVigilanteDarkTheme instead of defaultDarkTheme

### Added
- E2E smoke tests with Playwright
  - Homepage load verification
  - Case navigation tests
  - Theme toggle functionality
  - Contact form accessibility
  - Case detail page loading

### Fixed
- CSS theme synchronization between build-time and runtime
- Navbar hover states consistency
- Blue icon colors preserved across theme switches

## [1.1.1] - 2025-01-14

## [1.2.0] - 2025-11-15

### Added
- CI workflow that runs lint/test/build on Node 22 and scans commits with Gitleaks.
- Documented Sentry configuration and updated README to reflect Node 22 requirements and the current repository name.

### Changed
- Pinned `@krisarmstrong/web-foundation` to the version-tagged `v0.8.0` release for deterministic builds.
- Updated navigation tests to the latest PRIMARY_NAV order.

### Changed
- **Repository and project renamed** for consistency
  - GitHub repo: `wifi-vigilante` → `wifivigilante-com`
  - Project name: `wifivigilante` → `wifivigilante-com`
  - Aligns with wi-fivigilante.com domain

## [1.2.1] - 2025-11-15

### Added
- Adopted the shared `ContactForm` from `@krisarmstrong/web-foundation@0.9.0` so the Wi-Fi Vigilante contact experience matches krisarmstrong.org (honeypot, offline messaging, privacy notice).

### Changed
- Updated to the newest foundation build with Tailwind 4 storybook plumbing so buttons, nav, and cards stay in sync with the design system.


## [1.1.0] - 2025-01-14

### Changed
- **Replaced filter dropdowns with tag-click filtering** (matches portfolio UX)
  - Removed complex `CaseFilters` component with 4 dropdowns
  - Now using simple tag-click filtering like krisarmstrong-portfolio
  - Click tags on case cards to filter by tag
  - Shows active filter as removable badge
  - Much cleaner, more intuitive interface
- **Refactored CaseOverview page** to use new web-foundation components
  - Using `ActiveFilterBadges` for filter display
  - Using `LoadMoreButton` for progressive loading
  - Using `EmptyState` for no results
  - Using `useProgressiveLoad` hook for state management
  - Eliminated ~200 lines of duplicate code
- Upgraded to `@krisarmstrong/web-foundation@0.7.0`
  - New filter, loading, and empty state components
  - Fixed ContentSort dropdown visibility

### Removed
- `CaseFilters` component (replaced with tag-click filtering)
- Sector and subsector filtering (simplified to tags only)
- Tool filtering (simplified to tags only)

## [1.0.1] - 2025-01-14

### Added
- **Site-wide Search** component with keyboard shortcut (Ctrl/Cmd+K)
  - Searches pages, sectors, and case categories
  - Modal overlay with instant results
  - Accessible in both desktop header and mobile drawer
  - Emerald theme matching site design
- **YouTube** social link in footer
  - Added with placeholder URL (needs actual channel URL)
- **framer-motion** dependency for Contact page animations

### Fixed
- **CRITICAL SECURITY**: Removed .env files with real credentials from Git tracking
  - Removed .env.development, .env.staging, .env.production from repository
  - Updated .gitignore to prevent future credential exposure
  - Environment files now properly excluded (only .env.example tracked)

### Changed
- Upgraded to `@krisarmstrong/web-foundation@0.6.1`
  - Fixes critical security vulnerability in Error component
  - Improves ContentSort dropdown visibility

## [1.0.0] - 2025-01-14

### Added
- **ContentSearch** component on Cases page for instant search
  - Searches titles, descriptions, tags, sectors, and tools
  - Real-time client-side filtering
  - Result count display
  - Emerald accent color matching site theme
- **ContentSort** component with case-specific sorting
  - Newest First (default)
  - By Severity (Critical → Low)
  - By Duration (Longest → Shortest)
  - Alphabetical (A-Z)
- **Contact page** with Formspree integration
  - Consistent design with portfolio site
  - Emerald accent color
  - Form validation and honeypot spam protection
- **"Load More" button** for progressive case disclosure
  - Loads 12 cases at a time
  - Shows remaining count
  - Modern UX pattern

### Changed
- **Navigation menu reordered** for consistency
  - Home → About → Cases → Case of the Day → Contact
  - About moved to position 2 (matches portfolio site)
- **Removed Search page** - Redundant with instant search on Cases page
- **Replaced pagination** (1, 2, 3) with "Load More" button
  - More modern UX
  - Better mobile experience
  - Consistent with portfolio site
- **Switched to client-side search** from server-side API calls
  - Instant results
  - Works with dropdown filters
  - No network latency
- Upgraded to `@krisarmstrong/web-foundation@0.6.0`
- Cases grid already using optimal 3-column layout

### Fixed
- Added Formspree endpoint to environment variables

### Removed
- Server-side search hook (`useCaseSearch`)
- Search page and route
- Pagination components

## [0.9.2] - Prior releases

See git history for earlier changes.
