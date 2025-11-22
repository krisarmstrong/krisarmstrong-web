import { useState, useEffect } from 'react';

/**
 * Simple theme hook - Professional approach using CSS classes only
 * Replaces complex ThemeContext with minimal JavaScript
 */
export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Read from localStorage or system preference
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (systemDark ? 'dark' : 'light');

    // Apply theme class to <html>
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setThemeState(initial);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        // Only follow system if user hasn't set preference
        document.documentElement.classList.toggle('dark', e.matches);
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
