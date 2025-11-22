# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Playwright E2E testing infrastructure for all 3 apps
- E2E smoke tests covering critical user journeys
- Comprehensive ARCHITECTURE.md documentation
- Detailed THEMING.md documentation
- E2E test scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:report`

### Changed
- Synchronized all CSS theme values across @theme, ThemeContext, and tokens.ts
- Updated wifiVigilante focus colors for consistency (dark: #93c5fd → #2563eb, light: #1e40af → #3b82f6)
- Updated tokens.ts fallback values to match light mode themes
- Reduced wifivigilante navbar height (icon: 28px → 24px, removed lg:text-2xl)

### Fixed
- CSS theme synchronization issues between build-time and runtime values
- Theme focus color mismatches across all apps
- tokens.ts status.info fallback (#3b82f6 → #2563eb)

### Documentation
- Added comprehensive architecture documentation
- Added detailed theming system documentation
- Documented three-layer CSS approach with synchronization requirements
- Documented future CSS simplification plans

## [1.1.1] - 2025-11-21

### Fixed
- Resolved all remaining test failures (7 tests fixed)
- Enabled 52 previously skipped tests across all apps
- Cleared localStorage in ThemeContext tests to prevent test pollution
- Fixed ContactForm async test failures

### Added
- Shared test utilities to reduce code duplication
- Comprehensive testing guide

### Changed
- Improved test reliability and reduced flakiness
- Better test isolation between test suites

## [1.1.0] - Previous Release

### Added
- Monorepo structure with npm workspaces
- Shared web-foundation component library
- Three production apps: wifivigilante, intrinsic, krisarmstrong
- Theme system with dark/light mode support
- Sentry error tracking
- Web vitals monitoring

### Infrastructure
- Vite 7.x build system
- Vitest for unit testing
- ESLint + Prettier for code quality
- Husky + Commitlint for git workflow
- Turbo for monorepo builds

---

## App-Specific Changelogs

- [WiFi Vigilante CHANGELOG](./apps/wifivigilante/CHANGELOG.md)
- [Intrinsic Momentum Mindset CHANGELOG](./apps/intrinsic/CHANGELOG.md)
- [Kris Armstrong CHANGELOG](./apps/krisarmstrong/CHANGELOG.md)

---

*For detailed commit history, see: https://github.com/[username]/krisarmstrong-web/commits/main*
