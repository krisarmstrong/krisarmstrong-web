import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Theme } from '../types';
import { themeTokens } from '../tokens';

type Accent = 'blue' | 'violet';

const accentMap: Record<Accent, { border: string; icon: string; arrow: string; shadow: string }> = {
  blue: {
    border: 'hover:border-blue-500 focus-visible:ring-blue-500',
    icon: 'text-blue-400',
    arrow: 'group-hover:text-blue-400',
    shadow: 'hover:shadow-blue-900/40',
  },
  violet: {
    border: 'hover:border-violet-500 focus-visible:ring-violet-500',
    icon: 'text-violet-400',
    arrow: 'group-hover:text-violet-400',
    shadow: 'hover:shadow-violet-900/40',
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

export function NavCard({ to, title, description, icon, accent = 'blue', theme = 'dark' }: NavCardProps) {
  const colors = accentMap[accent] || accentMap.blue;
  const palette = themeTokens[theme] || themeTokens.dark;
  const ringOffsetClass = theme === 'light' ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-gray-900';

  return (
    <Link
      to={to}
      className={`group relative border p-6 rounded-lg shadow-lg ${colors.shadow} hover:shadow-xl focus:outline-none transition-all duration-200 ease-in-out hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 ${ringOffsetClass} ${colors.border}`}
      style={{
        backgroundColor: palette.surfaceRaised,
        borderColor: palette.border,
        color: palette.textPrimary,
      }}
      aria-label={`${title} - navigate`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`${colors.icon} transition-colors`}>{icon}</div>
        <ArrowRight
          size={20}
          className={`transition-transform duration-200 ease-in-out group-hover:translate-x-1 ${colors.arrow}`}
          style={{ color: palette.textMuted }}
        />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm leading-normal" style={{ color: palette.textMuted }}>
        {description}
      </p>
    </Link>
  );
}
