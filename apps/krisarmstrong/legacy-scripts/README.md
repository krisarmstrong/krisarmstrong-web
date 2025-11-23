# Legacy Scripts Archive

This directory contains old migration and development scripts that are no longer actively used in the project.

## Contents

### Blog Content Migration Scripts (2021-2025)

- `upload-2021-posts.js` - Migrated 2021 blog posts to Supabase
- `upload-2022-posts.js` - Migrated 2022 blog posts to Supabase
- `upload-2023-posts.js` - Migrated 2023 blog posts to Supabase
- `upload-2024-2025-posts.js` - Migrated 2024-2025 blog posts to Supabase
- `upload-vlan-posts.js` - Migrated VLAN-related content
- `upload-vlan-posts-part2.js` - Continued VLAN content migration

### Content Generation Scripts

- `generate-2025-posts.js` - Generated blog posts for 2025
- `generate-all-remaining-posts.js` - Batch generated remaining posts
- `generate-ALL-2025-posts.js` - Alternative 2025 post generation
- `generate-remaining-posts.js` - Generated missing posts
- `generate-final-posts.sh` - Shell script for final post generation
- `NEW-POSTS-2024-2025-METADATA.js` - Metadata for new posts

### Database Migration Scripts

- `migrate-blog-to-supabase.js` - Initial Supabase migration utility
- `query-existing-posts.js` - Query utility for existing posts

### Validation & Testing Scripts

- `check-vlan-posts.js` - Validated VLAN post data
- `a11y-smoke.js` - Accessibility smoke tests
- `smoke.sh` - General smoke testing script
- `security-audit-local.js` - Local security audit utility

### Development Utilities

- `token-usage-test.js` - API token usage testing
- `token-usage-test.cjs` - CommonJS version of token usage test
- `weekly-health-aggregator.js` - Health metrics aggregation

## Purpose

These scripts were part of one-time migrations and content generation tasks. They are preserved here for reference but should not be used in active development.

## Status

**Archived:** 2025-11-22
**Reason:** Dead code cleanup - these scripts are no longer referenced in package.json or used in the application

## Active Scripts

For currently active scripts, see the `/scripts` directory which contains:

- `generate-sitemap.js` - Active sitemap generation
- `generate-blog-metadata.js` - Active metadata generation
- `update-version.mjs` - Active version management
