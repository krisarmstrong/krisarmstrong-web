import { ReactNode } from 'react';
import { Check, Circle, ChevronRight } from 'lucide-react';

type ListStyle = 'bullet' | 'check' | 'number' | 'dash' | 'arrow';
type ListSpacing = 'compact' | 'normal' | 'relaxed';

interface ListProps {
  children: ReactNode;
  /** List style variant */
  style?: ListStyle;
  /** Spacing between items */
  spacing?: ListSpacing;
  /** Custom className */
  className?: string;
  /** Accent color for markers */
  accentColor?: 'violet' | 'blue' | 'sage' | 'green' | 'red';
}

interface ListItemProps {
  children: ReactNode;
  className?: string;
}

const spacingClasses: Record<ListSpacing, string> = {
  compact: 'space-y-1',
  normal: 'space-y-2',
  relaxed: 'space-y-3',
};

const accentColorClasses: Record<string, string> = {
  violet: 'text-violet-400',
  blue: 'text-blue-400',
  sage: 'text-green-400',
  green: 'text-emerald-400',
  red: 'text-red-400',
};

/**
 * List component with consistent styling for bulleted/numbered lists
 */
export function List({
  children,
  style = 'bullet',
  spacing = 'normal',
  className = '',
  accentColor = 'violet',
}: ListProps) {
  const spacingClass = spacingClasses[spacing];
  const colorClass = accentColorClasses[accentColor];

  if (style === 'number') {
    return (
      <ol className={`list-decimal list-inside ${spacingClass} text-text-muted ${className}`}>
        {children}
      </ol>
    );
  }

  return (
    <ul className={`${spacingClass} ${className}`} data-list-style={style} data-accent-color={accentColor}>
      {children}
    </ul>
  );
}

/**
 * ListItem component - use inside List
 */
export function ListItem({ children, className = '' }: ListItemProps) {
  // Get parent list context
  const parentList = typeof window !== 'undefined' ?
    document.querySelector('[data-list-style]') : null;
  const style = parentList?.getAttribute('data-list-style') as ListStyle || 'bullet';
  const accentColor = parentList?.getAttribute('data-accent-color') || 'violet';
  const colorClass = accentColorClasses[accentColor];

  const renderMarker = () => {
    switch (style) {
      case 'check':
        return <Check size={16} className={`flex-shrink-0 ${colorClass}`} />;
      case 'arrow':
        return <ChevronRight size={16} className={`flex-shrink-0 ${colorClass}`} />;
      case 'bullet':
        return <Circle size={8} className={`flex-shrink-0 ${colorClass} fill-current mt-2`} />;
      case 'dash':
        return <span className={`flex-shrink-0 ${colorClass} font-bold`}>—</span>;
      default:
        return <Circle size={8} className={`flex-shrink-0 ${colorClass} fill-current mt-2`} />;
    }
  };

  if (style === 'number') {
    return <li className={`text-text-muted ${className}`}>{children}</li>;
  }

  return (
    <li className={`flex items-start gap-2 text-text-muted ${className}`}>
      {renderMarker()}
      <span className="flex-1">{children}</span>
    </li>
  );
}
