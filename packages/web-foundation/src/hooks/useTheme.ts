import { useState, useEffect } from 'react';

/**
 * Simple theme hook - Professional approach using CSS classes only
 * Replaces complex ThemeContext with minimal JavaScript
 * Now with cross-tab synchronization
 */
export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Read current theme from DOM (set by inline script in <head>)
    const isDark = document.documentElement.classList.contains('dark');
    setThemeState(isDark ? 'dark' : 'light');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        // Only follow system if user hasn't set preference
        document.documentElement.classList.toggle('dark', e.matches);
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    // Listen for theme changes in other tabs (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const newTheme = e.newValue as 'light' | 'dark';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        setThemeState(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    // Update DOM
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    // Persist to localStorage
    localStorage.setItem('theme', newTheme);

    // Update state
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
}
