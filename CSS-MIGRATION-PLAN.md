# CSS Theming Migration Plan

**Goal:** Migrate from 3-4 redundant theming methods to single professional @theme approach

**Status:** Phase 1 In Progress - WiFi Vigilante

---

## Current State (Before Migration)

### Method 1: @theme (Build-time CSS) ✅ KEEPING

- **Location:** Each app's `src/index.css`
- **Properties:** 19 colors per theme (light/dark)
- **Missing:** Font family variables

### Method 2: ThemeContext (Runtime JavaScript) ❌ REMOVING

- **Location:** `packages/web-foundation/src/context/ThemeContext.tsx`
- **Properties:** 19 colors + 2 fonts per theme
- **Problem:** Duplicates @theme, runtime overhead

### Method 3: tokens.ts (Fallback chains) ⚠️ SIMPLIFYING

- **Location:** `packages/web-foundation/src/tokens.ts`
- **Properties:** Color fallbacks + layout constants + typography scale
- **Keep:** Layout/typography constants
- **Remove:** Color fallback chains

### Method 4: Intrinsic Only (Duplicate) ❌ REMOVING

- **Location:** `apps/intrinsic/src/shared-tokens.css`
- **Problem:** Duplicates @theme with :root variables

---

## Migration Phases

### ✅ Phase 0: Comprehensive Audit (COMPLETED)

- [x] Audited all 3 methods across all 3 apps
- [x] Identified unique properties in each method
- [x] Verified nothing will be lost
- [x] Created migration checklist

**Findings:**

- 19 color properties per theme (already in @theme)
- 2 font properties per theme (MISSING from @theme)
- Layout constants (keep in tokens.ts)
- Typography scale (keep in tokens.ts)

---

### 🔄 Phase 1: Add Missing Pieces to @theme (IN PROGRESS)

**Goal:** Get @theme to 100% complete before removing anything

#### WiFi Vigilante (Current)

- [x] Add `--font-family-heading` to @theme light
- [x] Add `--font-family-body` to @theme light
- [x] Add `--font-family-heading` to @theme dark
- [x] Add `--font-family-body` to @theme dark
- [x] Build successful ✅
- [ ] Run unit tests
- [ ] Visual test in browser
- [ ] Test theme toggle

#### Intrinsic (Next)

- [ ] Add `--font-family-heading` to @theme
- [ ] Add `--font-family-body` to @theme
- [ ] Build and test

#### Kris Armstrong (Last)

- [ ] Add `--font-family-heading` to @theme
- [ ] Add `--font-family-body` to @theme
- [ ] Build and test

**Status After Phase 1:**

- @theme has EVERYTHING ✅
- ThemeContext still working (safety net) ✅
- tokens.ts still working (safety net) ✅

---

### Phase 2: Create Simple useTheme Hook (PENDING)

**Goal:** Replace ThemeContext with minimal hook

**Tasks:**

1. [ ] Create new `useTheme` hook (15 lines) in web-foundation
2. [ ] Update theme toggle buttons to use new hook
3. [ ] Keep ThemeContext installed but unused (rollback safety)
4. [ ] Test theme toggle works on all 3 apps

**New Hook Location:** `packages/web-foundation/src/hooks/useTheme.ts`

**Implementation:**

```typescript
export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (systemDark ? 'dark' : 'light');

    document.documentElement.classList.toggle('dark', initial === 'dark');
    setThemeState(initial);
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  return { theme, setTheme };
}
```

**Status After Phase 2:**

- New hook working ✅
- ThemeContext unused but present (can rollback) ✅

---

### Phase 3: Remove ThemeContext Runtime CSS (PENDING)

**Goal:** Delete Method 2 safely

**Tasks:**

1. [ ] Remove ThemeContext provider from App.tsx files
2. [ ] Remove ThemeContext imports
3. [ ] Delete ThemeContext.tsx file
4. [ ] Test everything still works without ThemeContext

**Files to modify:**

- `apps/wifivigilante/src/App.tsx`
- `apps/intrinsic/src/App.tsx`
- `apps/krisarmstrong/src/App.tsx`
- `packages/web-foundation/src/context/ThemeContext.tsx` (DELETE)

**Status After Phase 3:**

- Down to 2 methods ✅
- @theme is sole source of theme values ✅

---

### Phase 4: Simplify tokens.ts (PENDING)

**Goal:** Remove color fallbacks, keep only shared constants

**Tasks:**

1. [ ] Remove `colorTokens` export (no longer needed)
2. [ ] Remove `themeTokens` export (check usage first)
3. [ ] Keep `layoutTokens` and `typographyTokens` (shared constants)
4. [ ] Update components to use CSS variables directly (no fallback chain)
5. [ ] Test all builds work, all components styled correctly

**What stays in tokens.ts:**

- layoutTokens (contentMaxWidth, gutterX, spacing, breakpoints, borderRadius)
- typographyTokens (fontSize, fontWeight, lineHeight, fontFamily.mono)

**What gets removed:**

- colorTokens (all color fallback chains)
- themeTokens (if not used elsewhere)

**Status After Phase 4:**

- Down to 1 method for colors ✅
- tokens.ts = shared constants only ✅

---

### Phase 5: Final Cleanup (PENDING)

**Goal:** Remove duplicates and inconsistencies

**Tasks:**

1. [ ] Delete `apps/intrinsic/src/shared-tokens.css` (duplicate)
2. [ ] Update THEMING.md documentation
3. [ ] Run full test suite (unit + E2E)
4. [ ] Visual regression test all 3 apps
5. [ ] Update ARCHITECTURE.md if needed

**Final state:**

- Single @theme directive per app ✅
- Simple useTheme hook for toggle ✅
- tokens.ts = shared constants only ✅
- Clean, professional architecture ✅

---

## Testing Strategy

**After EACH phase:**

1. ✅ `npm run build` - All 3 apps build successfully
2. ✅ `npm run test` - All unit tests pass
3. ✅ Visual test - Load each app in browser, toggle theme
4. ✅ Check all pages - Colors/fonts render correctly

**If anything fails:** Rollback that phase, fix, try again.

---

## Rollback Plan

**Each phase is independent and can be rolled back:**

- **Phase 1:** Just remove the added font-family lines from @theme
- **Phase 2:** Keep using ThemeContext, delete new hook
- **Phase 3:** Re-add ThemeContext
- **Phase 4:** Restore colorTokens export
- **Phase 5:** Restore deleted files from git

**Safety:** We add before we remove, test after each change.

---

## Current Progress

**Date:** 2025-11-22
**Current Phase:** Phase 1 - WiFi Vigilante
**Status:** Build successful ✅
**Next:** Run tests and visual verification

**WiFi Vigilante Changes:**

- Added `--font-family-heading: Space Grotesk, system-ui, sans-serif;`
- Added `--font-family-body: Inter, system-ui, sans-serif;`
- Both light and dark themes updated
- Build: PASSED ✅
- Tests: PENDING
- Visual: PENDING
