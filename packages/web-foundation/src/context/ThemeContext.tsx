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
    hover: '#dddbd4', // Distinct earth-toned hover (more visible)
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
      heading: 'Space Grotesk, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
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
    hover: '#3a4838', // Distinct green-tinted hover (more visible)
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
      heading: 'Space Grotesk, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
  },
};

export const wifiVigilanteTheme: ThemeConfig = {
  brand: {
    primary: '#2563eb', // Vibrant blue
    accent: '#3b82f6', // Medium blue
  },
  surface: {
    base: '#ffffff',
    raised: '#f8fafc',
    border: '#e2e8f0',
    hover: '#dbeafe', // Distinct blue-tinted hover (more visible)
  },
  text: {
    primary: '#0f172a',
    muted: '#64748b',
    accent: '#2563eb', // Vibrant blue to match header
    inverse: '#ffffff',
  },
  interactive: {
    default: '#2563eb',
    hover: '#1d4ed8',
    active: '#1e40af', // Much darker blue for strong contrast on light background
    focus: '#3b82f6',
    disabled: '#cbd5e1',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#2563eb',
  },
  typography: {
    fontFamily: {
      heading: 'Space Grotesk, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
  },
};

export const wifiVigilanteDarkTheme: ThemeConfig = {
  brand: {
    primary: '#60a5fa', // Bright blue
    accent: '#3b82f6', // Medium blue
  },
  surface: {
    base: '#0f172a', // Deep navy
    raised: '#1e293b', // Lighter navy
    border: '#334155', // Subtle slate border
    hover: '#2d4a6f', // Distinct blue-tinted hover (more visible)
  },
  text: {
    primary: '#f1f5f9',
    muted: '#94a3b8',
    accent: '#60a5fa', // Bright blue to match header
    inverse: '#ffffff', // White text on active elements
  },
  interactive: {
    default: '#60a5fa',
    hover: '#3b82f6',
    active: '#2563eb', // Vibrant saturated blue for maximum visibility
    focus: '#2563eb',
    disabled: '#475569',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#60a5fa',
  },
  typography: {
    fontFamily: {
      heading: 'Space Grotesk, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
  },
};

export const krisArmstrongTheme: ThemeConfig = {
  brand: {
    primary: '#0d9488', // Modern Teal - tech-forward and professional
    accent: '#14b8a6', // Bright Teal accent
  },
  surface: {
    base: '#ffffff', // Pure white for maximum clarity
    raised: '#f8fafc', // Subtle slate tint
    border: '#e2e8f0', // Light slate border
    hover: '#f1f5f9', // Light hover state
  },
  text: {
    primary: '#0f172a', // Deep slate for excellent readability
    muted: '#64748b', // Slate for secondary text
    accent: '#0d9488', // Teal accent text
    inverse: '#ffffff',
  },
  interactive: {
    default: '#0d9488', // Teal
    hover: '#0f766e', // Darker teal on hover
    active: '#14b8a6', // Bright teal for active state
    focus: '#14b8a6', // Bright teal for focus
    disabled: '#cbd5e1',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9', // Updated to cyan
  },
  typography: {
    fontFamily: {
      heading: 'Space Grotesk, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
  },
};

export const krisArmstrongDarkTheme: ThemeConfig = {
  brand: {
    primary: '#2dd4bf', // Bright Teal - vibrant in dark mode
    accent: '#5eead4', // Lighter teal accent
  },
  surface: {
    base: '#0f172a', // Deep slate background
    raised: '#1e293b', // Slate raised surface
    border: '#2dd4bf', // Teal border for strong contrast
    hover: '#334155', // Distinct hover state
  },
  text: {
    primary: '#f1f5f9', // Bright text
    muted: '#94a3b8', // Muted slate
    accent: '#5eead4', // Light teal accent
    inverse: '#0f172a',
  },
  interactive: {
    default: '#2dd4bf', // Bright teal
    hover: '#14b8a6', // Medium teal on hover
    active: '#5eead4', // Light teal for active state
    focus: '#5eead4', // Light teal for focus
    disabled: '#475569',
  },
  status: {
    success: '#34d399', // Brighter green for dark mode
    warning: '#fbbf24', // Brighter yellow for dark mode
    error: '#f87171', // Brighter red for dark mode
    info: '#38bdf8', // Bright cyan
  },
  typography: {
    fontFamily: {
      heading: 'Space Grotesk, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
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
        return JSON.parse(stored) as ThemeConfig;
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

  const setMode = useMemo(() => (allowThemeUpdates ? setModeState : () => {}), [allowThemeUpdates]);

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

  // Apply theme colors and mode to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme colors
    if (theme.brand?.primary) root.style.setProperty('--color-brand-primary', theme.brand.primary);
    if (theme.brand?.accent) root.style.setProperty('--color-brand-accent', theme.brand.accent);

    if (theme.surface?.base) root.style.setProperty('--color-surface-base', theme.surface.base);
    if (theme.surface?.raised)
      root.style.setProperty('--color-surface-raised', theme.surface.raised);
    if (theme.surface?.border)
      root.style.setProperty('--color-surface-border', theme.surface.border);
    if (theme.surface?.hover) root.style.setProperty('--color-surface-hover', theme.surface.hover);

    if (theme.text?.primary) root.style.setProperty('--color-text-primary', theme.text.primary);
    if (theme.text?.muted) root.style.setProperty('--color-text-muted', theme.text.muted);
    if (theme.text?.accent) root.style.setProperty('--color-text-accent', theme.text.accent);
    if (theme.text?.inverse) root.style.setProperty('--color-text-inverse', theme.text.inverse);

    if (theme.interactive?.default)
      root.style.setProperty('--color-interactive-default', theme.interactive.default);
    if (theme.interactive?.hover)
      root.style.setProperty('--color-interactive-hover', theme.interactive.hover);
    if (theme.interactive?.active)
      root.style.setProperty('--color-interactive-active', theme.interactive.active);
    if (theme.interactive?.focus)
      root.style.setProperty('--color-interactive-focus', theme.interactive.focus);
    if (theme.interactive?.disabled)
      root.style.setProperty('--color-interactive-disabled', theme.interactive.disabled);

    if (theme.status?.success)
      root.style.setProperty('--color-status-success', theme.status.success);
    if (theme.status?.warning)
      root.style.setProperty('--color-status-warning', theme.status.warning);
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
