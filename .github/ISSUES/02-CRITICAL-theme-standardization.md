---
title: "🔴 CRITICAL: Standardize theme system across all apps (currently 3 different approaches)"
labels: css, tailwind, critical, refactor, bug
assignees: krisarmstrong
---

## Priority: CRITICAL 🔴

**Impact:** Theme system inconsistency causing styling bugs and maintenance nightmare

## Current State (BROKEN)

We have **THREE different theming approaches** across apps:

| App | Approach | File | Lines |
|-----|----------|------|-------|
| **Intrinsic** | CSS Variables + @theme | `apps/intrinsic/src/index.css` | 9-53 |
| **KrisArmstrong** | JavaScript Tokens | `apps/krisarmstrong/tailwind.config.js` | 1 |
| **WiFiVigilante** | CSS Variables + @theme | `apps/wifivigilante/src/index.css` | 6-50 |

## Problems This Causes
1. ❌ Style changes require updating 3 different systems
2. ❌ Theme drift between apps
3. ❌ Developer confusion
4. ❌ Difficult to maintain consistency
5. ❌ Hard to debug styling issues

## Recommended Solution

**Standardize on CSS Variables + @theme approach** (Intrinsic/WiFiVigilante pattern)

### Implementation Steps

#### Phase 1: Create unified theme in web-foundation
- [ ] Create `packages/web-foundation/src/themes/base.css` with core CSS variables
- [ ] Create `packages/web-foundation/src/themes/README.md` documenting theme system
- [ ] Define standard theme interface/structure

#### Phase 2: Migrate KrisArmstrong
- [ ] Remove JS token imports from `apps/krisarmstrong/tailwind.config.js`
- [ ] Create `apps/krisarmstrong/src/themes/krisarmstrong.css` with @theme block
- [ ] Import theme in `apps/krisarmstrong/src/index.css`
- [ ] Test all pages for styling regressions
- [ ] Update any component-specific theme usage

#### Phase 3: Standardize Intrinsic
- [ ] Verify `apps/intrinsic/src/index.css` follows new standard
- [ ] Move shared theme variables to web-foundation
- [ ] Update imports

#### Phase 4: Standardize WiFiVigilante
- [ ] Verify `apps/wifivigilante/src/index.css` follows new standard
- [ ] Move shared theme variables to web-foundation
- [ ] Update imports

#### Phase 5: Update Tailwind configs
- [ ] Standardize all `tailwind.config.js` files to use same pattern
- [ ] Remove inconsistent color definitions
- [ ] Ensure all use `var(--color-*)` pattern

#### Phase 6: Documentation & Testing
- [ ] Document theme system in web-foundation README
- [ ] Add theme switching examples
- [ ] Create migration guide for future apps
- [ ] Test dark/light mode in all apps
- [ ] Test theme persistence (localStorage)
- [ ] Visual regression testing across all apps

## Files to Modify

### Delete/Replace
- `apps/krisarmstrong/tailwind.config.js` (remove JS token approach)
- Remove any `@krisarmstrong/web-foundation` token imports

### Update
- `apps/intrinsic/src/index.css`
- `apps/krisarmstrong/src/index.css`
- `apps/wifivigilante/src/index.css`
- `apps/intrinsic/tailwind.config.js`
- `apps/krisarmstrong/tailwind.config.js`
- `apps/wifivigilante/tailwind.config.js`

### Create
- `packages/web-foundation/src/themes/base.css`
- `packages/web-foundation/src/themes/README.md`
- `apps/krisarmstrong/src/themes/krisarmstrong.css`

## Success Criteria
- [ ] All apps use same theming approach
- [ ] Theme changes can be made in one place
- [ ] Dark/light mode works consistently across all apps
- [ ] No styling regressions
- [ ] Developer documentation clear and complete
- [ ] Zero styling bugs after migration

## References
- Current analysis: Repository analysis report
- Tailwind 4 CSS docs: https://tailwindcss.com/docs/v4-beta
- web-foundation themes already exist at `packages/web-foundation/src/themes/*.css`
