export const krisarmstrongTheme = {
  '--theme-brand-primary': '#8b5cf6', // Purple from logo
  '--theme-brand-accent': '#c084fc', // Lighter purple (Tailwind purple-400)

  '--theme-surface-base': '#0f172a', // Dark blue-gray (default from web-foundation)
  '--theme-surface-raised': '#1e293b', // Darker blue-gray (default from web-foundation)
  '--theme-surface-border': '#334155', // Gray (default from web-foundation)
  '--theme-surface-hover': '#1e293b', // Darker blue-gray (default from web-foundation)

  '--theme-text-primary': '#f1f5f9', // Light text (default from web-foundation)
  '--theme-text-muted': '#94a3b8', // Muted text (default from web-foundation)
  '--theme-text-accent': '#c084fc', // Lighter purple (reusing brand accent)
  '--theme-text-inverse': '#0f172a', // Dark inverse text

  '--theme-interactive-default': '#8b5cf6', // Purple (reusing brand primary)
  '--theme-interactive-hover': '#7c3aed', // Darker purple (Tailwind purple-600)
  '--theme-interactive-active': '#c084fc', // Lighter purple (reusing brand accent)
  '--theme-interactive-focus': '#c084fc', // Lighter purple (reusing brand accent)
  '--theme-interactive-disabled': '#64748b', // Gray (default from web-foundation)

  // Status colors (using defaults from web-foundation/src/tokens.ts for now)
  '--theme-status-success': '#10b981',
  '--theme-status-warning': '#f59e0b',
  '--theme-status-error': '#ef4444',
  '--theme-status-info': '#3b82f6',
};
