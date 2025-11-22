---
title: "🟢 LOW: Remove duplicate social icons and use web-foundation constants"
labels: code-duplication, low-priority, refactor
assignees: krisarmstrong
---

## Priority: LOW 🟢

**Impact:** ~40 lines of duplicated SVG code for social links

## Current State

Social link SVG icons are duplicated in Footer components:

- `apps/krisarmstrong/src/components/Footer.tsx:3-40`
- `apps/wifivigilante/src/components/Footer.tsx:3-40`

Both define nearly identical GitHub, LinkedIn, Twitter, YouTube icons.

## Existing Solution

web-foundation already has social icons:
- `packages/web-foundation/src/constants/socialIcons.tsx`

But apps aren't using it consistently.

## Implementation

### Step 1: Review web-foundation socialIcons

Check `packages/web-foundation/src/constants/socialIcons.tsx`:

```typescript
// Should export icons like:
export const socialIcons = {
  github: <svg>...</svg>,
  linkedin: <svg>...</svg>,
  twitter: <svg>...</svg>,
  youtube: <svg>...</svg>,
  // etc.
};
```

If missing icons, add them to web-foundation.

### Step 2: Export from web-foundation

Ensure `packages/web-foundation/src/index.ts` exports:

```typescript
export { socialIcons } from './constants/socialIcons';
```

### Step 3: Update KrisArmstrong Footer

`apps/krisarmstrong/src/components/Footer.tsx`:

```typescript
import { socialIcons } from '@krisarmstrong/web-foundation';

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/krisarmstrong', icon: socialIcons.github },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/krisarmstrong', icon: socialIcons.linkedin },
  { name: 'Twitter', href: 'https://twitter.com/krisarmstrong', icon: socialIcons.twitter },
  { name: 'YouTube', href: 'https://youtube.com/@krisarmstrong', icon: socialIcons.youtube },
];

export function Footer() {
  return (
    <footer>
      {/* ... */}
      <div className="social-links">
        {socialLinks.map((link) => (
          <a key={link.name} href={link.href} aria-label={link.name}>
            {link.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
```

### Step 4: Update WiFiVigilante Footer

Same approach for `apps/wifivigilante/src/components/Footer.tsx`.

### Step 5: Intrinsic Footer

`apps/intrinsic/src/components/Footer.tsx` is minimal (1 line - re-export).

Verify it uses web-foundation Footer component correctly.

### Step 6: Build and test

```bash
cd packages/web-foundation
npm run build

cd ../../apps/krisarmstrong
npm run dev
# Verify social links render

cd ../wifivigilante
npm run dev
# Verify social links render
```

## Testing Checklist
- [ ] web-foundation exports all needed social icons
- [ ] KrisArmstrong Footer uses shared icons
- [ ] WiFiVigilante Footer uses shared icons
- [ ] All social links render correctly
- [ ] Icons are styled properly
- [ ] Links are accessible (aria-labels)
- [ ] No visual regressions

## Files to Modify

### Update (if needed)
- `packages/web-foundation/src/constants/socialIcons.tsx` (ensure all icons present)
- `packages/web-foundation/src/index.ts` (export socialIcons)

### Update
- `apps/krisarmstrong/src/components/Footer.tsx` (use shared icons)
- `apps/wifivigilante/src/components/Footer.tsx` (use shared icons)

### Verify
- `apps/intrinsic/src/components/Footer.tsx` (already minimal)

## Success Criteria
- [ ] ~40 lines of duplicate SVG removed
- [ ] All apps use shared social icons
- [ ] Social links work in all apps
- [ ] Easy to add new social platforms

## Benefits
- **Code reduction:** ~40 lines removed
- **Consistency:** Same icons across apps
- **Maintainability:** Update icons in one place
- **Scalability:** Easy to add new social platforms
- **DX:** No copy-paste of SVG code
