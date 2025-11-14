# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
