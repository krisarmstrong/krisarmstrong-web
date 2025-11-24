---
title: '🟡 MEDIUM: Restore deleted documentation and standardize docs across apps'
labels: documentation, medium-priority, intrinsic
assignees: krisarmstrong
---

**Status: CLOSED (2025-11-24) — Core docs restored and expanded (README, SETUP, ARCHITECTURE, THEMING, TESTING, SECURITY, CONTRIBUTING, RELEASE_PLAN).**

## Priority: MEDIUM 🟡

**Impact:** Missing important documentation, inconsistent docs across apps

## Current State

Recent git deletions in Intrinsic:

```
D apps/intrinsic/ARCHITECTURE.md
D apps/intrinsic/CHANGELOG.md
D apps/intrinsic/CONTRIBUTING.md
D apps/intrinsic/ENVIRONMENT_SETUP.md
D apps/intrinsic/SECURITY.md
D apps/intrinsic/THEMING.md
```

Also deleted in web-foundation:

```
D packages/web-foundation/ARCHITECTURE.md
D packages/web-foundation/CHANGELOG.md
D packages/web-foundation/CONTRIBUTING.md
D packages/web-foundation/SECURITY.md
D packages/web-foundation/THEMING.md
```

### Documentation Comparison

| Doc Type     | Root | Intrinsic  | KrisArmstrong | WiFiVigilante | web-foundation |
| ------------ | ---- | ---------- | ------------- | ------------- | -------------- |
| README       | ✅   | ✅         | ✅            | ✅            | ✅             |
| CONTRIBUTING | ✅   | ❌ Deleted | ✅            | ✅            | ❌ Deleted     |
| CHANGELOG    | ❌   | ❌ Deleted | ✅            | ✅            | ❌ Deleted     |
| THEMING      | ❌   | ❌ Deleted | ✅            | ✅            | ❌ Deleted     |
| SECURITY     | ✅   | ❌ Deleted | ❌            | ❌            | ❌ Deleted     |

## Problems

1. Intrinsic missing important documentation
2. Inconsistent docs across apps
3. New contributors lack guidance
4. Theming system undocumented
5. No app-specific contribution guidelines

## Solution

**Option 1:** Restore deleted docs with updated content
**Option 2:** Consolidate to root and link from apps (recommended)

## Recommended: Consolidate Approach

### Step 1: Decide what stays at root

Keep at root (applies to all apps):

- `CONTRIBUTING.md` ✅ (already exists)
- `SECURITY.md` ✅ (already exists)
- `SETUP.md` ✅ (already exists)
- `README.md` ✅ (already exists)

### Step 2: Create app-specific docs

Each app should have:

#### `apps/*/README.md` (already exists, ensure completeness)

- App overview
- Features
- Development setup
- Link to root docs

#### `apps/*/THEMING.md` (create/restore)

- App-specific theme configuration
- Color palette
- Dark/light mode examples
- How to customize

#### Example: `apps/intrinsic/THEMING.md`

```markdown
# Intrinsic App - Theme Configuration

This app uses the sage/earth tone theme from web-foundation.

## Theme Colors

### Light Mode

- Primary: Sage green (#8B9A7E)
- Accent: Warm terracotta (#D4907B)
- Background: Warm white (#FAF9F6)

### Dark Mode

- Primary: Muted sage (#6B7A5E)
- Accent: Deep terracotta (#B4705B)
- Background: Dark charcoal (#2A2A2A)

## Customization

Theme is defined in `src/index.css`:

\`\`\`css
@theme {
--color-brand-primary: #8B9A7E;
--color-brand-accent: #D4907B;
/_ ... _/
}
\`\`\`

For more details on the theming system, see:

- [web-foundation theming docs](../../packages/web-foundation/src/themes/README.md)
- [Root README - Theming System](../../README.md#theming-system)
```

### Step 3: Update app READMEs to link to root docs

All app READMEs should have:

```markdown
## Documentation

- **Setup Guide**: See [SETUP.md](../../SETUP.md)
- **Contributing**: See [CONTRIBUTING.md](../../CONTRIBUTING.md)
- **Security**: See [SECURITY.md](../../SECURITY.md)
- **Theming**: See [THEMING.md](./THEMING.md)

## App-Specific Documentation

- Theme configuration and customization
- Feature overview
- Development workflow
```

### Step 4: Create CHANGELOG management strategy

**For apps:** Use semantic-release to auto-generate

Ensure each app has:

- Version in `package.json`
- Semantic-release configured
- CI workflow triggers releases

**For web-foundation:** Already has semantic-release

### Step 5: Create ARCHITECTURE documentation

Create `docs/ARCHITECTURE.md` at root:

```markdown
# Architecture Overview

## Monorepo Structure

[Describe workspace organization]

## Build System

[Describe Turbo + npm workspaces]

## Theming System

[Describe unified theme approach]

## Deployment

[Describe Vercel deployment]

## Testing Strategy

[Describe test approach]
```

Link from README and app docs.

### Step 6: Document theming system centrally

Create `packages/web-foundation/src/themes/README.md`:

```markdown
# Web Foundation - Theming System

## Overview

All apps use CSS variables for theming with dark/light mode support.

## Theme Structure

[Explain theme tokens]

## Creating Themes

[How to create app-specific themes]

## Dark/Light Mode

[How mode switching works]

## Examples

[Show theme examples from each app]
```

## Implementation Checklist

### Root Documentation

- [ ] Verify CONTRIBUTING.md is complete
- [ ] Verify SECURITY.md is complete
- [ ] Verify SETUP.md is complete
- [ ] Create docs/ARCHITECTURE.md
- [ ] Create docs/TESTING.md

### Web Foundation

- [ ] Create packages/web-foundation/src/themes/README.md
- [ ] Restore/update packages/web-foundation/README.md
- [ ] Ensure API.md is complete

### Intrinsic App

- [ ] Create apps/intrinsic/THEMING.md
- [ ] Update apps/intrinsic/README.md with doc links
- [ ] Remove outdated references

### KrisArmstrong App

- [ ] Verify apps/krisarmstrong/THEMING.md
- [ ] Update apps/krisarmstrong/README.md
- [ ] Ensure CHANGELOG is managed by semantic-release

### WiFiVigilante App

- [ ] Verify apps/wifivigilante/THEMING.md
- [ ] Update apps/wifivigilante/README.md
- [ ] Ensure CHANGELOG is managed by semantic-release

### All Apps

- [ ] Link to root CONTRIBUTING.md
- [ ] Link to root SECURITY.md
- [ ] Link to root SETUP.md
- [ ] Have app-specific THEMING.md

## Files to Create

- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `packages/web-foundation/src/themes/README.md`
- `apps/intrinsic/THEMING.md`

## Files to Update

- All app `README.md` files (add doc links)
- `README.md` (link to new docs)

## Success Criteria

- [ ] All apps have consistent documentation structure
- [ ] No missing critical documentation
- [ ] Clear links between root and app docs
- [ ] Theming system fully documented
- [ ] Easy for new contributors to find information

## Benefits

- **Clarity:** Clear documentation hierarchy
- **Consistency:** Same structure across apps
- **Maintainability:** Update common docs once
- **Onboarding:** New developers find info easily
- **Professionalism:** Well-documented project
