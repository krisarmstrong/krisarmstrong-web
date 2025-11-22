import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Theme } from '../types';

type Accent = 'blue' | 'violet' | 'teal';

const accentMap: Record<Accent, { border: string; icon: string; arrow: string }> = {
  blue: {
    border: 'hover:border-brand-accent/50 focus-visible:ring-brand-accent',
    icon: 'text-text-accent',
    arrow: 'group-hover:text-interactive-hover',
  },
  violet: {
    border: 'hover:border-brand-accent/50 focus-visible:ring-brand-accent',
    icon: 'text-text-accent',
    arrow: 'group-hover:text-interactive-hover',
  },
  teal: {
    border: 'hover:border-brand-accent/50 focus-visible:ring-brand-accent',
    icon: 'text-text-accent',
    arrow: 'group-hover:text-interactive-hover',
  },
};

export interface NavCardProps {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent?: Accent;
  theme?: Theme;
}

export function NavCard({
  to,
  title,
  description,
  icon,
  accent = 'blue',
  theme = 'dark',
}: NavCardProps) {
  const colors = accentMap[accent] || accentMap.blue;
  const ringOffsetClass =
    theme === 'light' ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-gray-900';

  return (
    <Link
      to={to}
      className={`group relative bg-surface-raised border border-surface-border p-6 rounded-2xl shadow-lg hover:shadow-xl focus:outline-none transition-all duration-200 ease-in-out hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 ${ringOffsetClass} ${colors.border} no-underline`}
      aria-label={`${title} - navigate`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`${colors.icon} transition-colors`}>{icon}</div>
        <ArrowRight
          size={20}
          className={`text-text-muted transition-transform duration-200 ease-in-out group-hover:translate-x-1 ${colors.arrow}`}
        />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted leading-normal">
        {description}
      </p>
    </Link>
  );
}
