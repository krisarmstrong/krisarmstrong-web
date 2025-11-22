import { NavLink } from 'react-router-dom';
import { cloneElement, isValidElement } from 'react';
import type { NavItem } from '../types';

type NavVariant = 'violet' | 'blue' | 'sage';
type Orientation = 'horizontal' | 'vertical';

interface PrimaryNavProps {
  items: NavItem[];
  orientation?: Orientation;
  variant?: NavVariant;
  className?: string;
  onNavigate?: () => void;
}

const variantClasses: Record<NavVariant, { active: string; inactive: string; icon: string }> = {
  violet: {
    active:
      'bg-interactive-active text-text-inverse shadow-lg shadow-interactive-active/30 scale-[1.02]',
    inactive:
      'text-text-primary hover:bg-surface-hover hover:text-text-accent hover:shadow-md transition-all duration-200 ease-in-out',
    icon: 'text-text-accent transition-colors duration-200',
  },
  blue: {
    active:
      'bg-interactive-active text-text-inverse shadow-lg shadow-interactive-active/30 scale-[1.02]',
    inactive:
      'text-text-primary hover:bg-surface-hover hover:text-text-accent hover:shadow-md transition-all duration-200 ease-in-out',
    icon: 'text-text-accent transition-colors duration-200',
  },
  sage: {
    active:
      'bg-interactive-active text-text-inverse shadow-lg shadow-interactive-active/30 scale-[1.02]',
    inactive:
      'text-text-primary hover:bg-surface-hover hover:text-text-accent hover:shadow-md transition-all duration-200 ease-in-out',
    icon: 'text-text-accent transition-colors duration-200',
  },
};

export function PrimaryNav({
  items,
  orientation = 'horizontal',
  variant = 'violet',
  className = '',
  onNavigate,
}: PrimaryNavProps) {
  const wrapperBase =
    orientation === 'horizontal'
      ? 'flex items-center gap-2 lg:gap-3'
      : 'flex flex-col gap-2 w-full';

  const themeClasses = variantClasses[variant];

  const activeClasses = themeClasses.active;
  const inactiveClasses = themeClasses.inactive;
  const iconClasses = themeClasses.icon;

  const baseLinkClasses =
    'flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const orientationClasses =
    orientation === 'horizontal'
      ? 'focus:ring-violet-500'
      : 'focus:ring-violet-500 w-full justify-between';

  return (
    <nav className={`${wrapperBase} ${className}`.trim()} aria-label="Primary navigation">
      {items.map((item) => {
        const isExternal = Boolean(item.isExternal || /^https?:\/\//.test(item.path));

        // Apply icon color class by cloning the icon element
        const styledIcon =
          item.icon && isValidElement(item.icon)
            ? cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                className: iconClasses,
              })
            : item.icon;

        const content = (
          <>
            <span className="flex items-center gap-2">
              {styledIcon}
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
