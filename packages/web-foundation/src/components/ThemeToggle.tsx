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
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: 'var(--theme-surface-raised)',
        color: 'var(--theme-text-primary)',
        borderColor: 'var(--theme-surface-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-interactive-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-surface-raised)';
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
