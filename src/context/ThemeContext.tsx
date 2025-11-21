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
 * Validates if a string is a safe CSS color value
 * Prevents CSS injection attacks by checking for invalid characters
 * @param color - The color string to validate
 * @returns true if valid CSS color, false otherwise
 */
function isValidCSSColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;

  // Reject colors containing semicolons or other injection vectors
  if (color.includes(';') || color.includes('{') || color.includes('}')) {
    return false;
  }

  // Use CSS.supports to validate the color if available
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports('color', color);
  }

  // Fallback: test by applying to a temporary element
  const testElement = new Option().style;
  testElement.color = color;
  return testElement.color !== '';
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
  const [theme, setThemeState] = useState<ThemeConfig>(initialTheme);
  const [mode, setModeState] = useState<ColorMode>(initialMode);

  const setTheme = useMemo(
    () => (allowThemeUpdates ? setThemeState : () => {}),
    [allowThemeUpdates]
  );

  const setMode = useMemo(() => (allowThemeUpdates ? setModeState : () => {}), [allowThemeUpdates]);

  // Apply CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;

    // Helper function to safely set CSS property
    const setSafeProperty = (name: string, value: string) => {
      if (isValidCSSColor(value)) {
        root.style.setProperty(name, value);
      } else {
        console.warn(`[ThemeProvider] Invalid CSS color value for ${name}:`, value);
      }
    };

    // Brand colors
    if (theme.brand?.primary) setSafeProperty('--theme-brand-primary', theme.brand.primary);
    if (theme.brand?.accent) setSafeProperty('--theme-brand-accent', theme.brand.accent);

    // Surface colors
    if (theme.surface?.base) setSafeProperty('--theme-surface-base', theme.surface.base);
    if (theme.surface?.raised) setSafeProperty('--theme-surface-raised', theme.surface.raised);
    if (theme.surface?.border) setSafeProperty('--theme-surface-border', theme.surface.border);

    // Text colors
    if (theme.text?.primary) setSafeProperty('--theme-text-primary', theme.text.primary);
    if (theme.text?.muted) setSafeProperty('--theme-text-muted', theme.text.muted);
    if (theme.text?.accent) setSafeProperty('--theme-text-accent', theme.text.accent);

    // Interactive colors
    if (theme.interactive?.hover)
      setSafeProperty('--theme-interactive-hover', theme.interactive.hover);
    if (theme.interactive?.active)
      setSafeProperty('--theme-interactive-active', theme.interactive.active);
    if (theme.interactive?.focus)
      setSafeProperty('--theme-interactive-focus', theme.interactive.focus);

    // Apply color mode class
    root.classList.remove('light', 'dark');
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
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
