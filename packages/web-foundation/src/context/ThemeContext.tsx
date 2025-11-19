import { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';

/**
 * Theme configuration interface
 * All colors should be CSS values (hex, rgb, hsl, CSS variables, etc.)
 */
export interface ThemeConfig {
  /** Brand colors */
  brand?: {
    primary?: string;
    accent?: string;
  };
  /** Surface/background colors */
  surface?: {
    base?: string;
    raised?: string;
    border?: string;
    hover?: string;
  };
  /** Text colors */
  text?: {
    primary?: string;
    muted?: string;
    accent?: string;
    inverse?: string;
  };
  /** Interactive state colors */
  interactive?: {
    default?: string;
    hover?: string;
    active?: string;
    focus?: string;
    disabled?: string;
  };
  /** Status colors */
  status?: {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
  /** Typography */
  typography?: {
    fontFamily?: {
      heading?: string;
      body?: string;
      mono?: string;
    };
  };
}

/**
 * Color mode: light, dark, or auto (follows system preference)
 */
export type ColorMode = 'light' | 'dark' | 'auto';

export interface ThemeContextValue {
  /** Theme configuration */
  theme: ThemeConfig;
  /** Color mode */
  mode: ColorMode;
  /** Update theme configuration */
  setTheme: (theme: ThemeConfig) => void;
  /** Update color mode */
  setMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Default dark theme configuration
 */
export const defaultDarkTheme: ThemeConfig = {
  brand: {
    primary: '#3b82f6',
    accent: '#8b5cf6',
  },
  surface: {
    base: '#0f172a',
    raised: '#1e293b',
    border: '#334155',
    hover: '#1e293b',
  },
  text: {
    primary: '#f1f5f9',
    muted: '#94a3b8',
    accent: '#8b5cf6',
    inverse: '#0f172a',
  },
  interactive: {
    default: '#3b82f6',
    hover: '#2563eb',
    active: '#8b5cf6',
    focus: '#8b5cf6',
    disabled: '#64748b',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

/**
 * Default light theme configuration
 */
export const defaultLightTheme: ThemeConfig = {
  brand: {
    primary: '#3b82f6',
    accent: '#8b5cf6',
  },
  surface: {
    base: '#ffffff',
    raised: '#f8fafc',
    border: '#e2e8f0',
    hover: '#f1f5f9',
  },
  text: {
    primary: '#0f172a',
    muted: '#64748b',
    accent: '#8b5cf6',
    inverse: '#ffffff',
  },
  interactive: {
    default: '#3b82f6',
    hover: '#2563eb',
    active: '#8b5cf6',
    focus: '#8b5cf6',
    disabled: '#cbd5e1',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

/**
 * Intrinsic Momentum Mindset theme (sage/earth tones)
 */
export const intrinsicTheme: ThemeConfig = {
  brand: {
    primary: '#96A77A',
    accent: '#CFB53B',
  },
  surface: {
    base: '#F8F6F1',
    raised: '#FFFFFF',
    border: '#4A574A',
    hover: '#E8E6E1',
  },
  text: {
    primary: '#303F33',
    muted: '#4A574A',
    accent: '#CFB53B',
    inverse: '#F8F6F1',
  },
  interactive: {
    default: '#96A77A',
    hover: '#7A8A62',
    active: '#CFB53B',
    focus: '#CFB53B',
    disabled: '#D9D7CF',
  },
  status: {
    success: '#96A77A',
    warning: '#CFB53B',
    error: '#B85450',
    info: '#5B7A8F',
  },
  typography: {
    fontFamily: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
    },
  },
};

export const intrinsicDarkTheme: ThemeConfig = {
  brand: {
    primary: '#A8BA8E',
    accent: '#E0C84F',
  },
  surface: {
    base: '#1A1F1C',
    raised: '#242B27',
    border: '#96A77A',
    hover: '#2F3830',
  },
  text: {
    primary: '#E8EDE4',
    muted: '#A8BA8E',
    accent: '#E0C84F',
    inverse: '#1A1F1C',
  },
  interactive: {
    default: '#A8BA8E',
    hover: '#96A77A',
    active: '#E0C84F',
    focus: '#E0C84F',
    disabled: '#3F4940',
  },
  status: {
    success: '#A8BA8E',
    warning: '#E0C84F',
    error: '#CF6B67',
    info: '#7A9AAF',
  },
  typography: {
    fontFamily: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
    },
  },
};

export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  /** Initial theme configuration (default: defaultDarkTheme) */
  initialTheme?: ThemeConfig;
  /** Initial color mode (default: 'dark') */
  initialMode?: ColorMode;
  /** Allow theme updates (default: true) */
  allowThemeUpdates?: boolean;
}

/**
 * ThemeProvider - Provides theme configuration to all child components
 *
 * @example
 * ```tsx
 * <ThemeProvider initialTheme={customTheme} initialMode="dark">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  initialTheme = defaultDarkTheme,
  initialMode = 'dark',
  allowThemeUpdates = true,
}: ThemeProviderProps) {
  // Initialize from localStorage if available
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') return initialTheme;

    const stored = localStorage.getItem('theme-config');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialTheme;
      }
    }
    return initialTheme;
  });

  const [mode, setModeState] = useState<ColorMode>(() => {
    if (typeof window === 'undefined') return initialMode;

    const stored = localStorage.getItem('theme-mode');
    return (stored as ColorMode) || initialMode;
  });

  const setTheme = useMemo(
    () => (allowThemeUpdates ? setThemeState : () => {}),
    [allowThemeUpdates]
  );

  const setMode = useMemo(
    () => (allowThemeUpdates ? setModeState : () => {}),
    [allowThemeUpdates]
  );

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && allowThemeUpdates) {
      localStorage.setItem('theme-config', JSON.stringify(theme));
    }
  }, [theme, allowThemeUpdates]);

  // Persist mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && allowThemeUpdates) {
      localStorage.setItem('theme-mode', mode);
    }
  }, [mode, allowThemeUpdates]);

  // Apply CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;

    // Brand colors
    if (theme.brand?.primary) root.style.setProperty('--color-brand-primary', theme.brand.primary);
    if (theme.brand?.accent) root.style.setProperty('--color-brand-accent', theme.brand.accent);

    // Surface colors
    if (theme.surface?.base) root.style.setProperty('--color-surface-base', theme.surface.base);
    if (theme.surface?.raised) root.style.setProperty('--color-surface-raised', theme.surface.raised);
    if (theme.surface?.border) root.style.setProperty('--color-surface-border', theme.surface.border);
    if (theme.surface?.hover) root.style.setProperty('--color-surface-hover', theme.surface.hover);

    // Text colors
    if (theme.text?.primary) root.style.setProperty('--color-text-primary', theme.text.primary);
    if (theme.text?.muted) root.style.setProperty('--color-text-muted', theme.text.muted);
    if (theme.text?.accent) root.style.setProperty('--color-text-accent', theme.text.accent);
    if (theme.text?.inverse) root.style.setProperty('--color-text-inverse', theme.text.inverse);

    // Interactive colors
    if (theme.interactive?.default) root.style.setProperty('--color-interactive-default', theme.interactive.default);
    if (theme.interactive?.hover) root.style.setProperty('--color-interactive-hover', theme.interactive.hover);
    if (theme.interactive?.active) root.style.setProperty('--color-interactive-active', theme.interactive.active);
    if (theme.interactive?.focus) root.style.setProperty('--color-interactive-focus', theme.interactive.focus);
    if (theme.interactive?.disabled) root.style.setProperty('--color-interactive-disabled', theme.interactive.disabled);

    // Status colors
    if (theme.status?.success) root.style.setProperty('--color-status-success', theme.status.success);
    if (theme.status?.warning) root.style.setProperty('--color-status-warning', theme.status.warning);
    if (theme.status?.error) root.style.setProperty('--color-status-error', theme.status.error);
    if (theme.status?.info) root.style.setProperty('--color-status-info', theme.status.info);

    // Apply color mode class
    root.classList.remove('light', 'dark');
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.add(mode);
    }
  }, [theme, mode]);

  const value = useMemo(
    () => ({ theme, mode, setTheme, setMode }),
    [theme, mode, setTheme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme - Hook to access theme context
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * useOptionalTheme - Hook to optionally access theme context
 * Returns null if no ThemeProvider is present
 *
 * @example
 * ```tsx
 * const theme = useOptionalTheme();
 * const bgColor = theme?.theme.surface?.base || '#0f172a';
 * ```
 */
export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
