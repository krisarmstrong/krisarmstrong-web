import { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Simple ThemeProvider - Initializes theme on mount
 * Ensures theme is loaded before components render
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // This hook call initializes the theme (reads localStorage, applies .dark class)
  useTheme();

  return <>{children}</>;
}
