# Accessibility Features

This document outlines all accessibility improvements implemented in the Wi-Fi Vigilante application.

## Overview

Wi-Fi Vigilante follows **WCAG 2.1 Level AA** guidelines to ensure the application is accessible to all users, including those using assistive technologies like screen readers, keyboard-only navigation, and mobile devices.

## Key Accessibility Features

### 1. Keyboard Navigation

#### Global Keyboard Shortcuts
- **Ctrl+K / Cmd+K** - Quick search shortcut (works from anywhere in the app)
- **Escape** - Close mobile menu, user menu, or notification dropdown
- **Tab / Shift+Tab** - Navigate through interactive elements

#### Focus Management
- Skip to main content link (visible on focus)
- Focus trap in mobile drawer (prevents focus from escaping)
- Auto-focus on first interactive element when mobile menu opens
- Visible focus indicators on all interactive elements
- Keyboard shortcut hint displayed on search button (Ctrl+K badge)

**Implementation**: `src/Layout.tsx:56-119`

### 2. Screen Reader Support

#### ARIA Labels and Roles
All interactive elements have proper ARIA labels:
- Navigation items: `aria-label="Navigate to {page}"`
- Mobile menu button: `aria-expanded` and `aria-label`
- User menu: `aria-expanded` and role attributes
- Notifications: Dynamic `aria-label` showing unread count
- Mobile drawer: `role="dialog"` and `aria-modal="true"`
- Breadcrumbs: `aria-label="Breadcrumb"` and `aria-current="page"`

#### Semantic HTML
- Proper heading hierarchy (H1, H2, H3)
- `<nav>` elements for navigation sections
- `<main>` element with `id="main-content"` for skip link target
- `<button>` vs `<a>` used correctly based on function

**Implementation**: `src/Layout.tsx`, `src/components/Breadcrumbs.tsx`

### 3. Skip to Main Content

A hidden link that appears on keyboard focus, allowing users to bypass navigation and jump directly to main content.

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only ...">
  Skip to main content
</a>
```

**Implementation**: `src/Layout.tsx:102-107`

### 4. Mobile Accessibility

#### Touch Gestures
- **Swipe from right edge** (left to right) - Open mobile navigation drawer
- **Swipe on drawer** (right to left) - Close mobile navigation drawer
- Minimum swipe distance: 50 pixels
- Edge detection zone: 30-50 pixels from right edge

**Implementation**: `src/Layout.tsx:123-183`

#### Mobile Navigation Improvements
- Large touch targets (minimum 44x44 pixels)
- Clear visual hierarchy with sections
- User information prominently displayed
- Quick action buttons for Profile and Admin

### 5. Recent Searches

Users can quickly access their search history without having to retype queries.

#### Features
- Stores last 5 searches in localStorage
- Displays when search input is empty
- Click to re-run search
- Individual remove buttons (X icon)
- "Clear all" button to remove entire history
- Persists across sessions

**Implementation**:
- Utility: `src/utils/recentSearches.ts`
- UI: `src/pages/Search.tsx:92-129`

### 6. Admin Notifications

Admin users can stay informed about important events without leaving their current page.

#### Features
- Bell icon in header (desktop only)
- Red badge showing unread count
- Dropdown with notification list
- Unread notifications highlighted with blue dot
- "Mark all as read" action
- Accessible with keyboard (Escape to close)

**Implementation**: `src/Layout.tsx:173-244`

### 7. Theme Toggle (Dark/Light Mode)

Users can choose their preferred color scheme or follow system preferences.

#### Features
- Toggle button in desktop navigation (Sun/Moon icon)
- Remembers user preference in localStorage
- Defaults to system preference if not set
- Smooth transitions between themes
- Proper contrast ratios in both themes
- CSS custom properties for easy theming

#### Theme Support
- **Dark Theme**: Default, optimized for low-light environments
- **Light Theme**: High contrast, optimized for bright environments
- System preference detection and auto-switching

**Implementation**:
- Context: `src/contexts/ThemeContext.tsx`
- Styles: `src/index.css:10-44`
- UI: `src/Layout.tsx:162-170`

### 8. Visual Indicators

#### Focus Visible
All interactive elements have clear focus indicators:
- Blue ring on focus (`focus:ring-2 focus:ring-blue-500`)
- Increased size on hover for cards (`hover:scale-[1.02]`)
- Color changes on hover and active states

#### Loading States
- Loading spinners with descriptive text
- Skeleton screens (placeholder content)
- "Loading page..." fallback message

#### Error States
- Clear error messages with icons
- Helpful instructions for recovery
- Error boundaries to prevent crashes

## Testing Accessibility

### Keyboard Testing
1. Tab through entire page
2. Verify all interactive elements are reachable
3. Test keyboard shortcuts (Ctrl+K, Escape)
4. Ensure skip link works
5. Verify focus trap in mobile drawer

### Screen Reader Testing
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Navigate through the page
3. Verify all images have alt text
4. Check form labels are associated
5. Verify ARIA labels are descriptive

### Mobile Testing
1. Test on real devices (iOS and Android)
2. Verify touch targets are large enough
3. Test swipe gestures
4. Check responsive layout
5. Verify pinch-to-zoom is not disabled

### Automated Testing
```bash
# Run accessibility linting
npm run lint

# Check for common issues
# Use browser extensions:
# - axe DevTools
# - WAVE
# - Lighthouse (Chrome DevTools)
```

## Accessibility Checklist

- [x] Keyboard navigation support
- [x] Screen reader support (ARIA labels)
- [x] Skip to main content link
- [x] Focus management and traps
- [x] Visible focus indicators
- [x] Semantic HTML structure
- [x] Proper heading hierarchy
- [x] Color contrast ratios (WCAG AA)
- [x] Touch targets (minimum 44x44px)
- [x] Mobile swipe gestures
- [x] Theme toggle (dark/light)
- [x] Loading states with text
- [x] Error states with recovery
- [x] Form validation with messages
- [x] Responsive design
- [x] No keyboard traps (except intended)

## Known Limitations

1. **Theme Support**: Light theme uses Tailwind classes, but some components may need additional styling updates
2. **Notifications**: Currently uses mock data; needs backend integration
3. **Search History**: Limited to 5 items; could be made configurable

## Future Improvements

1. Add more keyboard shortcuts (e.g., `/` for search, `n` for new case)
2. Implement high contrast mode
3. Add font size controls
4. Support reduced motion preference
5. Add live regions for dynamic content updates
6. Implement focus visible polyfill for older browsers
7. Add voice control support

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [Accessible Name Calculation](https://www.w3.org/TR/accname-1.1/)

## Contact

For accessibility concerns or suggestions, please open an issue on GitHub.
