import { ReactNode } from 'react';

type SectionVariant = 'default' | 'surface' | 'accent' | 'gradient';
type SectionSpacing = 'compact' | 'normal' | 'relaxed' | 'spacious';

interface SectionProps {
  children: ReactNode;
  /** Visual variant */
  variant?: SectionVariant;
  /** Vertical spacing */
  spacing?: SectionSpacing;
  /** Custom className */
  className?: string;
  /** Section background color override */
  background?: string;
  /** Accent color for gradient variant */
  accentColor?: 'violet' | 'blue' | 'sage';
}

const spacingClasses: Record<SectionSpacing, string> = {
  compact: 'py-8',
  normal: 'py-12',
  relaxed: 'py-16',
  spacious: 'py-20 md:py-32',
};

const variantClasses: Record<SectionVariant, string> = {
  default: '',
  surface: 'bg-surface',
  accent: 'bg-accent/10 border-y-2 border-accent/30',
  gradient: '',
};

const gradientClasses: Record<string, string> = {
  violet: 'bg-gradient-to-br from-background via-violet-900/5 to-indigo-900/10',
  blue: 'bg-gradient-to-br from-background via-blue-900/5 to-cyan-900/10',
  sage: 'bg-gradient-to-br from-background via-green-900/5 to-emerald-900/10',
};

/**
 * Section - Container component for page sections with consistent spacing
 */
export function Section({
  children,
  variant = 'default',
  spacing = 'normal',
  className = '',
  background,
  accentColor = 'violet',
}: SectionProps) {
  const spacingClass = spacingClasses[spacing];
  const variantClass =
    variant === 'gradient' ? gradientClasses[accentColor] : variantClasses[variant];
  const bgClass = background || variantClass;

  return (
    <section className={`${spacingClass} ${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/**
 * SectionHeader - Centered header for sections
 */
interface SectionHeaderProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {typeof title === 'string' ? (
        <h2 className="text-3xl md:text-4xl font-heading text-text-main mb-4">{title}</h2>
      ) : (
        title
      )}
      {description &&
        (typeof description === 'string' ? (
          <p className="text-xl text-text-muted max-w-3xl mx-auto">{description}</p>
        ) : (
          description
        ))}
    </div>
  );
}
