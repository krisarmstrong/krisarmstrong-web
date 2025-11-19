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

// Color tokens - comprehensive theme colors
export const colorTokens = {
  brand: {
    primary: 'var(--theme-brand-primary, var(--color-brand-primary, #3b82f6))',
    accent: 'var(--theme-brand-accent, var(--color-brand-accent, #8b5cf6))',
  },
  surface: {
    base: 'var(--theme-surface-base, var(--color-surface-base, #0f172a))',
    raised: 'var(--theme-surface-raised, var(--color-surface-raised, #1e293b))',
    border: 'var(--theme-surface-border, var(--color-surface-border, #334155))',
    hover: 'var(--theme-surface-hover, var(--color-surface-hover, #1e293b))',
  },
  text: {
    primary: 'var(--theme-text-primary, var(--color-text-primary, #f1f5f9))',
    muted: 'var(--theme-text-muted, var(--color-text-muted, #94a3b8))',
    accent: 'var(--theme-text-accent, var(--color-text-accent, #8b5cf6))',
    inverse: 'var(--theme-text-inverse, var(--color-text-inverse, #0f172a))',
  },
  interactive: {
    default: 'var(--theme-interactive-default, var(--color-interactive-default, #3b82f6))',
    hover: 'var(--theme-interactive-hover, var(--color-interactive-hover, #2563eb))',
    active: 'var(--theme-interactive-active, var(--color-interactive-active, #8b5cf6))',
    focus: 'var(--theme-interactive-focus, var(--color-interactive-focus, #8b5cf6))',
    disabled: 'var(--theme-interactive-disabled, var(--color-interactive-disabled, #64748b))',
  },
  status: {
    success: 'var(--theme-status-success, var(--color-status-success, #10b981))',
    warning: 'var(--theme-status-warning, var(--color-status-warning, #f59e0b))',
    error: 'var(--theme-status-error, var(--color-status-error, #ef4444))',
    info: 'var(--theme-status-info, var(--color-status-info, #3b82f6))',
  },
};

// Typography tokens
export const typographyTokens = {
  fontFamily: {
    heading: 'var(--theme-font-heading, var(--font-family-heading, ui-sans-serif, system-ui, sans-serif))',
    body: 'var(--theme-font-body, var(--font-family-body, ui-sans-serif, system-ui, sans-serif))',
    mono: 'var(--theme-font-mono, var(--font-family-mono, ui-monospace, monospace))',
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
