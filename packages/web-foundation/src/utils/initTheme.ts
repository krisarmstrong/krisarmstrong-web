/**
 * Initialize theme on app load - Simple JavaScript approach
 * No React hooks, just reads localStorage and applies .dark class
 */
export function initTheme(): void {
  // Read from localStorage or system preference
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemDark ? 'dark' : 'light');

  // Apply theme class to <html>
  document.documentElement.classList.toggle('dark', theme === 'dark');

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      // Only follow system if user hasn't set preference
      document.documentElement.classList.toggle('dark', e.matches);
    }
  };

  mediaQuery.addEventListener('change', handleChange);
}
