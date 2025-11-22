# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.2] - 2025-01-14

## [0.8.3] - 2025-11-15

### Changed
- Hardened Supabase data scripts to load credentials from `.env` and removed the committed service-role key.
- Added GitHub Actions workflow (lint/test/build + Gitleaks) to enforce quality gates on main.

### Changed
- **Favicon updated** to use avatar image
  - Browser tab now shows professional avatar instead of "KA"
  - Added apple-touch-icon for iOS devices
  - Updated all meta tags with avatar image
- **Updated all URLs** from krisarmstrong.com to krisarmstrong.org
  - Canonical URL
  - Open Graph URLs
  - Twitter card URLs
  - Structured data URLs
  - Analytics domain

## [0.8.4] - 2025-11-15

### Added
- Shared `ContactForm` from `@krisarmstrong/web-foundation@0.9.0` so Wi-Fi Vigilante and krisarmstrong.org stay in sync (includes offline messaging + spam honeypot).

### Fixed
- Resume typography no longer collapses after the Tailwind 4 migration—replaced the missing `@tailwind base` directives with the new `@import "tailwindcss"` entry point and layered custom prose styles so markdown renders correctly.
- Navbar avatar sizing regressed because of missing base styles; the CSS import change restores the proper image sizing.

### Changed
- Upgraded to the latest web-foundation build to inherit the button tone fixes and Storybook-tested components.

## [0.8.1] - 2025-01-14

### Added
- **Avatar image** in navbar replacing "KA" initials
  - Added professional avatar photo
  - Displayed in both desktop navbar and mobile drawer
  - Used `object-contain` to prevent cropping

### Changed
- **Repository and project renamed** for consistency
  - GitHub repo: `krisarmstrong-portfolio` → `krisarmstrong-org`
  - Project name: `krisarmstrong-portfolio` → `krisarmstrong-org`
  - Aligns with krisarmstrong.org domain

## [0.8.0] - 2025-01-14

### Changed
- **Refactored Blog page** to use new web-foundation components
  - Replaced custom filter badges with `ActiveFilterBadges` component
  - Replaced custom load more button with `LoadMoreButton` component
  - Replaced custom empty state with `EmptyState` component
  - Now using `useProgressiveLoad` hook for cleaner code
  - Eliminated ~80 lines of duplicate code
- Upgraded to `@krisarmstrong/web-foundation@0.7.0`
  - New filter, loading, and empty state components
  - Fixed ContentSort dropdown visibility

## [0.7.1] - 2025-01-14

### Added
- **YouTube** social link in footer
  - Added with placeholder URL (needs actual channel URL)

### Changed
- Upgraded to `@krisarmstrong/web-foundation@0.6.1`
  - Fixes critical security vulnerability in Error component
  - Improves ContentSort dropdown visibility

## [0.7.0] - 2025-01-14

### Added
- **ContentSearch** component on blog page for instant search
  - Searches titles, excerpts, content, and tags
  - Real-time filtering with debouncing
  - Result count display
- **ContentSort** component with new sorting options
  - Newest First (default)
  - Oldest First
  - Most Popular (by view count)
- 8 new VLAN Friday blog posts uploaded to Supabase
  1. VLAN Segmentation for Zero Trust Architecture
  2. Securing Wireless Networks with VLAN Design
  3. Private VLANs for Enhanced Security
  4. VLAN Design Best Practices for Enterprise Wireless
  5. Dynamic VLAN Assignment with 802.1X
  6. Voice and Data VLAN Separation
  7. VLAN Trunking and Inter-Switch Communication
  8. VXLANs: Extending VLANs Across Layer 3

### Changed
- **Blog grid layout**: Changed from 2-column to 3-column grid on desktop
  - Mobile: 1 column
  - Tablet (640px+): 2 columns
  - Desktop (1024px+): 3 columns
- Upgraded to `@krisarmstrong/web-foundation@0.6.0`
- Improved sort functionality to work with search and tag filters

### Fixed
- Supabase environment variables restored after system reboot
  - Added `VITE_SUPABASE_URL`
  - Added `VITE_SUPABASE_ANON_KEY`
  - Added `SUPABASE_SERVICE_ROLE_KEY`

## [0.6.1] - Prior releases

See git history for earlier changes.
