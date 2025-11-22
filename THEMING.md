# Theming System Documentation

## Overview

This project uses a sophisticated three-layer theming system that provides both build-time optimization and runtime flexibility. All three apps share the same theming infrastructure while maintaining their unique color palettes.

## Theme Color Palettes

### WiFi Vigilante (Blue Security Theme)

**Light Mode:**
- Primary: `#2563eb` (Medium Blue)
- Accent: `#3b82f6` (Bright Blue)
- Surface Base: `#ffffff` (White)
- Text Primary: `#0f172a` (Dark Slate)

**Dark Mode:**
- Primary: `#60a5fa` (Light Blue)
- Accent: `#3b82f6` (Bright Blue)
- Surface Base: `#0f172a` (Deep Navy)
- Text Primary: `#f1f5f9` (Off-White)

### Intrinsic Momentum Mindset (Earth/Sage Theme)

**Light Mode:**
- Primary: `#96A77A` (Sage Green)
- Accent: `#CFB53B` (Gold)
- Surface Base: `#F8F6F1` (Warm Off-White)
- Text Primary: `#303F33` (Deep Forest)

**Dark Mode:**
- Primary: `#A8BA8E` (Light Sage)
- Accent: `#E0C84F` (Bright Gold)
- Surface Base: `#1A1F1C` (Deep Forest)
- Text Primary: `#E8EDE4` (Warm White)

### Kris Armstrong (Professional Teal Theme)

**Light Mode:**
- Primary: `#0d9488` (Modern Teal)
- Accent: `#14b8a6` (Bright Teal)
- Surface Base: `#ffffff` (Pure White)
- Text Primary: `#0f172a` (Deep Slate)

**Dark Mode:**
- Primary: `#2dd4bf` (Bright Teal)
- Accent: `#5eead4` (Light Teal)
- Surface Base: `#0f172a` (Deep Slate)
- Surface Border: `#2dd4bf` (Teal Border for contrast!)
- Text Primary: `#f1f5f9` (Bright Text)

## The Three-Layer Architecture

### Layer 1: @theme (Build-Time - Tailwind CSS 4.x)

**Location:** `apps/[app-name]/src/index.css`

**Purpose:**
- Generates Tailwind utility classes (`bg-brand-primary`, `text-brand-primary`, etc.)
- Provides initial CSS custom properties available on page load
- Processed by Tailwind during build
- Creates utilities AND CSS variables

**Example:**
```css
@theme {
  /* Light Mode */
  --color-brand-primary: #2563eb;
  --color-brand-accent: #3b82f6;
  /* ... 24 more properties */
}

@theme dark {
  /* Dark Mode */
  --color-brand-primary: #60a5fa;
  --color-brand-accent: #3b82f6;
  /* ... 24 more properties */
}
```

**What Tailwind Generates:**
- Utilities: `bg-brand-primary`, `text-brand-primary`, `border-brand-primary`
- CSS vars: Available as `var(--color-brand-primary)`
- Build-time validation and optimization

### Layer 2: ThemeContext (Runtime - JavaScript)

**Location:** `packages/web-foundation/src/context/ThemeContext.tsx`

**Purpose:**
- Dynamic theme switching (light/dark toggle)
- Sets CSS custom properties via JavaScript after React mounts
- Stores user preference in localStorage
- Provides programmatic theme access

**Example:**
```typescript
export const wifiVigilanteTheme: ThemeConfig = {
  brand: {
    primary: '#2563eb',
    accent: '#3b82f6',
  },
  // ... 22 more properties
};

// Sets: document.documentElement.style.setProperty('--color-brand-primary', '#2563eb')
```

**Features:**
- TypeScript type safety
- Automatic localStorage persistence
- System preference detection
- Theme switching without page reload

### Layer 3: tokens.ts (Fallback Chain)

**Location:** `packages/web-foundation/src/tokens.ts`

**Purpose:**
- Provides multi-level fallback chain for safety
- Used in component styles
- Works even if @theme or ThemeContext fails

**Example:**
```typescript
export const colorTokens = {
  brand: {
    primary: 'var(--theme-brand-primary, var(--color-brand-primary, #2563eb))',
    //       ↑ Try ThemeContext        ↑ Try @theme           ↑ Ultimate fallback
  },
};
```

**Fallback Order:**
1. `--theme-brand-primary` (ThemeContext JS)
2. `--color-brand-primary` (@theme CSS)
3. `#2563eb` (Hardcoded fallback)

## How They Work Together

### Application Flow

```
Page Load
    ↓
1. Browser parses CSS
   - @theme creates :root CSS variables
   - Tailwind utilities available
    ↓
2. React mounts
   - ThemeContext reads localStorage
   - Sets theme CSS vars via JavaScript
   - Overrides @theme with user preference
    ↓
3. Components render
   - Use tokens.ts in styles
   - Fallback chain ensures values exist
```

### CSS Cascade & Specificity

**Specificity Order (what wins):**
1. **ThemeContext (inline styles)** - Highest specificity 🥇
   - `element.style.setProperty()` on :root
2. **@theme (layer theme)** - Medium specificity 🥈
   - Nested in `@layer theme`
3. **tokens.ts fallback** - Only used if others undefined 🥉

### Why All Three Layers?

Each layer serves a specific purpose:

| Layer | Purpose | When Used |
|-------|---------|-----------|
| **@theme** | Generate utilities, provide build-time values | Always (build time) |
| **ThemeContext** | Enable dynamic theme switching | When user toggles theme |
| **tokens.ts** | Safety net, component styling | In component CSS |

## Theme Synchronization

**Critical:** All three layers MUST have identical color values to avoid conflicts.

### Synchronization Checklist

For each theme property (26 total):
- ✅ @theme light mode value
- ✅ @theme dark mode value
- ✅ ThemeContext light theme value
- ✅ ThemeContext dark theme value
- ✅ tokens.ts fallback value (should match light mode)

### Verification

Run this check to verify sync:
```bash
# Compare @theme to ThemeContext
grep "color-brand-primary" apps/wifivigilante/src/index.css
grep "primary:" packages/web-foundation/src/context/ThemeContext.tsx | grep -A1 "wifiVigilante"

# Should match exactly!
```

## Adding a New Theme Property

1. **Update @theme block:**
```css
/* apps/[app]/src/index.css */
@theme {
  --color-my-new-property: #123456;
}
@theme dark {
  --color-my-new-property: #654321;
}
```

2. **Update ThemeContext:**
```typescript
// packages/web-foundation/src/context/ThemeContext.tsx
export const myTheme: ThemeConfig = {
  myCategory: {
    newProperty: '#123456',
  }
}
```

3. **Update tokens.ts:**
```typescript
// packages/web-foundation/src/tokens.ts
export const colorTokens = {
  myCategory: {
    newProperty: 'var(--theme-my-new-property, var(--color-my-new-property, #123456))',
  }
}
```

4. **Update TypeScript types:**
```typescript
// ThemeConfig interface
interface ThemeConfig {
  myCategory?: {
    newProperty?: string;
  };
}
```

## Using Themes in Components

### Method 1: Tailwind Utilities (Preferred)
```tsx
<div className="bg-brand-primary text-text-inverse">
  Content
</div>
```

### Method 2: CSS Custom Properties
```tsx
<div style={{ backgroundColor: 'var(--color-brand-primary)' }}>
  Content
</div>
```

### Method 3: tokens.ts in CSS
```typescript
import { colorTokens } from '@krisarmstrong/web-foundation';

const styles = {
  container: {
    backgroundColor: colorTokens.brand.primary,
  }
};
```

### Method 4: ThemeContext Hook
```typescript
import { useTheme } from '@krisarmstrong/web-foundation';

function MyComponent() {
  const { theme, mode, setMode } = useTheme();

  return (
    <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## Theme Toggle Implementation

Each app has a theme toggle in the navbar:

```tsx
import { ThemeToggle } from '@krisarmstrong/web-foundation';

<ThemeToggle
  lightTheme={wifiVigilanteTheme}
  darkTheme={wifiVigilanteDarkTheme}
/>
```

**Features:**
- Sun/Moon icons
- Smooth transitions
- localStorage persistence
- System preference detection
- Keyboard accessible

## Complete Theme Property List

Each theme includes 26 properties:

### Brand (2 properties)
- `primary` - Main brand color
- `accent` - Secondary accent color

### Surface (4 properties)
- `base` - Main background
- `raised` - Cards, modals
- `border` - Borders, dividers
- `hover` - Hover states

### Text (4 properties)
- `primary` - Main text color
- `muted` - Secondary text
- `accent` - Highlighted text
- `inverse` - Text on colored backgrounds

### Interactive (5 properties)
- `default` - Default interactive elements
- `hover` - Hover state
- `active` - Active/pressed state
- `focus` - Focus ring color
- `disabled` - Disabled state

### Status (4 properties)
- `success` - Success messages
- `warning` - Warning messages
- `error` - Error messages
- `info` - Informational messages

### Typography (1 property)
- `fontFamily` - Heading and body fonts

## Troubleshooting

### Colors Not Applying
1. Check all three layers have same value
2. Verify ThemeContext is wrapping app
3. Check browser DevTools computed styles
4. Ensure CSS is built (`npm run build`)

### Theme Not Persisting
1. Check localStorage in DevTools
2. Verify ThemeProvider has `initialMode="auto"`
3. Check for localStorage errors in console

### Utilities Not Generated
1. Ensure property starts with `--color-`
2. Rebuild app (`npm run build`)
3. Check Tailwind is processing the file
4. Verify `@source` directive points to correct path

## Future Migration Plan

**Goal:** Simplify to @theme + data attributes (reduce from 3 layers to 2)

**Benefits:**
- Single source of truth (CSS only)
- No sync issues
- Simpler maintenance
- Tailwind v4 best practice

**Approach:**
1. Keep @theme blocks
2. Remove ThemeContext CSS var setting
3. Use `data-theme` attribute for switching
4. ThemeContext only manages attribute
5. CSS handles theme switching

**Status:** Deferred until other work complete

## Resources

- [Tailwind CSS v4 Theme Documentation](https://tailwindcss.com/docs/theme)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Multi-Theme Strategy with Tailwind v4](https://simonswiss.com/posts/tailwind-v4-multi-theme)

---

*Last updated: 2025-11-22*
*All 3 apps fully synchronized across all theme layers*
