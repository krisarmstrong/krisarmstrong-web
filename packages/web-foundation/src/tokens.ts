// Layout tokens - spacing, breakpoints, sizing
export const layoutTokens = {
  contentMaxWidth: '80rem', // 1280px
  gutterX: {
    mobile: '1rem',
    desktop: '1.5rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
};

// Color tokens - reference @theme CSS variables
// These tokens reference the CSS variables defined in each app's @theme block
export const colorTokens = {
  brand: {
    primary: 'var(--color-brand-primary)',
    accent: 'var(--color-brand-accent)',
  },
  surface: {
    base: 'var(--color-surface-base)',
    raised: 'var(--color-surface-raised)',
    border: 'var(--color-surface-border)',
    hover: 'var(--color-surface-hover)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    muted: 'var(--color-text-muted)',
    accent: 'var(--color-text-accent)',
    inverse: 'var(--color-text-inverse)',
  },
  interactive: {
    default: 'var(--color-interactive-default)',
    hover: 'var(--color-interactive-hover)',
    active: 'var(--color-interactive-active)',
    focus: 'var(--color-interactive-focus)',
    disabled: 'var(--color-interactive-disabled)',
  },
  status: {
    success: 'var(--color-status-success)',
    warning: 'var(--color-status-warning)',
    error: 'var(--color-status-error)',
    info: 'var(--color-status-info)',
  },
};

// Typography tokens - reference @theme CSS variables and standard scales
export const typographyTokens = {
  fontFamily: {
    heading: 'var(--font-family-heading)',
    body: 'var(--font-family-body)',
    mono: 'var(--font-family-mono, ui-monospace, monospace)',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const themeTokens = {
  dark: {
    surfaceBase: 'var(--wf-dark-surface-base, #0f172a)',
    surfaceRaised: 'var(--wf-dark-surface-raised, #1e293b)',
    border: 'var(--wf-dark-border, #334155)',
    textPrimary: 'var(--wf-dark-text-primary, #f1f5f9)',
    textMuted: 'var(--wf-dark-text-muted, #94a3b8)',
    accent: 'var(--wf-dark-accent, #8b5cf6)',
    overlay: 'var(--wf-dark-overlay, rgba(0,0,0,0.65))',
  },
  light: {
    surfaceBase: 'var(--wf-light-surface-base, #f8fafc)',
    surfaceRaised: 'var(--wf-light-surface-raised, #ffffff)',
    border: 'var(--wf-light-border, #e2e8f0)',
    textPrimary: 'var(--wf-light-text-primary, #0f172a)',
    textMuted: 'var(--wf-light-text-muted, #475569)',
    accent: 'var(--wf-light-accent, #4f46e5)',
    overlay: 'var(--wf-light-overlay, rgba(15,23,42,0.35))',
  },
} as const;
