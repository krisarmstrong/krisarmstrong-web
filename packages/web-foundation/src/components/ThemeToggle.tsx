import { Moon, Sun } from 'lucide-react';
import { useSimpleTheme } from '../index';

export interface ThemeToggleProps {
  // Props no longer needed with CSS-first approach, but kept for backwards compatibility
  lightTheme?: unknown;
  darkTheme?: unknown;
}

export function ThemeToggle(_props: ThemeToggleProps) {
  const { theme, toggleTheme } = useSimpleTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-surface-raised text-text-primary border border-surface-border hover:bg-interactive-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
