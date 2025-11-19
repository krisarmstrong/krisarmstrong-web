# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-14

## [0.3.1] - 2025-11-15

### Fixed
- Tailwind 4 now loads via the new `@import "tailwindcss";` entrypoint so Vite no longer throws `@layer base` errors and the site stops crashing during dev builds.

### Changed
- Upgraded to `@krisarmstrong/web-foundation@0.9.0` to inherit the shared contact form/button fixes without touching the site's sage-and-gold palette.


## [0.3.0] - 2025-11-15

### Changed
- Migrated Navbar, Footer, and layout shell to the shared `@krisarmstrong/web-foundation@0.8.0` components with light-theme support.
- Wrapped the entire app in `ThemeProvider` with the intrinsic brand palette so future foundation updates propagate automatically.
- Documented Node 22 requirement, added CI workflows (lint/test/build + Gitleaks), and introduced `.env.example` with telemetry variables.

### Added
- GitHub Actions pipeline for quality gates and secret scanning on every push/PR.

### Changed
- **Complete site restructure** to multi-page layout
  - Separate pages: Home, About, Services, Contact, Privacy Policy, Terms of Service
  - React Router with proper navigation
  - web-foundation components (PrimaryNav, PageShell, etc.)
  - Similar structure to other Kris Armstrong sites
- **Services expanded** to four offerings:
  - 1:1 Coaching (for individuals, professionals, executives)
  - Group Coaching - Basic Class (8-week foundation program)
  - Group Coaching - Advanced Class (12-week intensive)
  - Corporate Leadership (workshops, training, keynotes)
- **Contact form** with complete fields:
  - Full Name, Email, Phone Number, Date of Birth, Gender, Message
- **More gold accents** throughout site
  - Gold borders on hero section elements
  - Gold highlighting on key text
  - Gold borders on service cards
  - Gold accent bar on cards
- **Updated branding**: Using circular MM logo (not full logo)
- **Footer** with social links (LinkedIn, Facebook, Instagram)
- **Legal pages**: Complete Privacy Policy and Terms of Service

### Added
- Navbar component with mobile drawer
- Footer component with social links and legal links
- Error boundary for error handling
- 404 Not Found page
- Loading spinner for lazy-loaded pages

## [0.1.1] - 2025-01-14

### Added
- **Brand logos** added to website
  - Full logo with three icons in navigation header
  - Circular MM icon logo as favicon and apple-touch-icon
  - Professional branding throughout site

## [0.1.0] - 2025-01-14

### Added
- **Complete coaching website** with sage/forest/gold color scheme
  - Sticky navigation with Book a Consult CTA
  - Hero section with dual CTAs
  - Three Pillars section (Intrinsic/Momentum/Mindset)
  - About section with grounded copy
  - Services section (1:1, Group, Corporate)
  - Testimonials section
  - Lead capture form
  - Footer with navigation
- **Brand colors** from design specification
  - Primary: Sage green (#96A77A)
  - Primary Dark: Forest green (#303F33)
  - Accent: Gold (#C5A247)
  - Background: Off-white (#F8F6F1)
- **Typography**: Poppins (headings) and Inter (body)
- **Responsive design**: Mobile-first layout
- **Accessibility**: WCAG AA compliant contrast
- **SEO**: Complete meta tags and structured data
