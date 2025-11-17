import { NavLink } from 'react-router-dom';
import type { NavItem } from '../types';
import { useOptionalTheme } from '../context/ThemeContext';

type NavVariant = 'violet' | 'blue' | 'sage';
type Orientation = 'horizontal' | 'vertical';

interface PrimaryNavProps {
  items: NavItem[];
  orientation?: Orientation;
  variant?: NavVariant;
  className?: string;
  onNavigate?: () => void;
}

const variantClasses: Record<NavVariant, { active: string; inactive: string }> = {
  violet: {
    active: 'bg-violet-600 text-white shadow-lg shadow-violet-500/50',
    inactive: 'text-gray-300 hover:bg-gray-800 hover:text-white',
  },
  blue: {
    active: 'bg-blue-600 text-white shadow-lg shadow-blue-500/40',
    inactive: 'text-gray-300 hover:bg-gray-700 hover:text-white',
  },
  sage: {
    active: 'bg-accent text-white shadow-md',
    inactive: 'text-text-main hover:bg-accent/10 hover:text-accent',
  },
};

export function PrimaryNav({
  items,
  orientation = 'horizontal',
  variant = 'violet',
  className = '',
  onNavigate,
}: PrimaryNavProps) {
  const theme = useOptionalTheme();

  const wrapperBase =
    orientation === 'horizontal'
      ? 'flex items-center gap-2 lg:gap-3'
      : 'flex flex-col gap-2 w-full';

  const themeClasses = theme
    ? {
        active: 'bg-interactive-active text-text-inverse shadow-lg',
        inactive: 'text-text-primary hover:bg-surface-hover hover:text-interactive-hover',
      }
    : variantClasses[variant];

  const activeClasses = themeClasses.active;
  const inactiveClasses = themeClasses.inactive;

  const baseLinkClasses =
    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  const orientationClasses =
    orientation === 'horizontal'
      ? 'focus:ring-violet-500'
      : 'focus:ring-violet-500 w-full justify-between';

  return (
    <nav className={`${wrapperBase} ${className}`.trim()} aria-label="Primary navigation">
      {items.map((item) => {
        const isExternal = Boolean(item.isExternal || /^https?:\/\//.test(item.path));
        const content = (
          <>
            <span className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </span>
            {item.badge && (
              <span className="text-xs font-semibold uppercase tracking-wide text-white bg-white/20 px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        );
        const combinedClasses = `${baseLinkClasses} ${orientationClasses} ${
          isExternal ? inactiveClasses : ''
        }`.trim();

        if (isExternal) {
          return (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noreferrer noopener"
              className={combinedClasses}
              onClick={onNavigate}
            >
              {content}
            </a>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                baseLinkClasses,
                orientationClasses,
                isActive ? activeClasses : inactiveClasses,
              ].join(' ')
            }
            onClick={onNavigate}
          >
            {content}
          </NavLink>
        );
      })}
    </nav>
  );
}
