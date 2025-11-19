import type { ReactNode, ComponentPropsWithoutRef, ElementType } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Polymorphic component props helper
type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends ElementType, Props = object> = Props &
  AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// Base heading props
interface HeadingProps {
  children: ReactNode;
  className?: string;
  accentColorClass?: string;
  icon?: ReactNode;
}

export function H1({
  children,
  className = '',
  accentColorClass,
  icon,
  ...props
}: PolymorphicComponentProp<'h1', HeadingProps>) {
  const colorClass = accentColorClass || 'text-text-primary';
  return (
    <h1
      className={`text-3xl sm:text-4xl font-extrabold ${colorClass} mb-6 sm:mb-8 flex items-center gap-2 ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </h1>
  );
}

export function H2({
  children,
  className = '',
  accentColorClass,
  icon,
  ...props
}: PolymorphicComponentProp<'h2', HeadingProps>) {
  const colorClass = accentColorClass || 'text-text-primary';
  return (
    <h2
      className={`text-2xl font-semibold ${colorClass} mb-4 flex items-center gap-2 ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </h2>
  );
}

// Simple heading interface
interface SimpleHeadingProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function ArticleTitle({
  children,
  className = '',
  ...props
}: PolymorphicComponentProp<'h2', SimpleHeadingProps>) {
  return (
    <h2
      className={`text-2xl lg:text-3xl font-bold text-text-primary mb-3 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SubSectionTitle({
  children,
  className = '',
  icon,
  ...props
}: PolymorphicComponentProp<'h3', SimpleHeadingProps>) {
  return (
    <h3
      className={`text-xl font-semibold text-text-primary border-b border-surface-border pb-2 mb-3 flex items-center gap-2 ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </h3>
  );
}

export function CardTitle({
  children,
  className = '',
  ...props
}: PolymorphicComponentProp<'h3', SimpleHeadingProps>) {
  return (
    <h3
      className={`text-lg font-semibold text-text-primary mb-1 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

const LEADING_CLASS_MAP: Record<'relaxed' | 'normal' | 'loose', string> = {
  relaxed: 'leading-relaxed',
  normal: 'leading-normal',
  loose: 'leading-loose',
};

// Paragraph props
interface ParagraphProps {
  children: ReactNode;
  className?: string;
  leading?: 'relaxed' | 'normal' | 'loose';
  size?: 'sm' | 'base';
  color?: 'primary' | 'muted' | 'accent';
}

export function P<C extends ElementType = 'p'>({
  children,
  className = '',
  leading = 'relaxed',
  size = 'base',
  color = 'muted',
  as,
  ...props
}: PolymorphicComponentProp<C, ParagraphProps>) {
  const Component = as || 'p';
  const sizeClass = size === 'sm' ? 'text-sm' : 'text-base';
  const leadingClass = LEADING_CLASS_MAP[leading] || LEADING_CLASS_MAP.relaxed;

  const colorClass = {
    primary: 'text-text-primary',
    muted: 'text-text-muted',
    accent: 'text-text-accent',
  }[color];

  return (
    <Component
      className={`${colorClass} ${sizeClass} ${leadingClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

interface SmallTextProps {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'muted' | 'accent';
  leading?: 'relaxed' | 'normal' | 'loose';
}

export function SmallText({
  children,
  className = '',
  color = 'muted',
  leading = 'normal',
  ...props
}: PolymorphicComponentProp<'p', SmallTextProps>) {
  const colorClass = {
    primary: 'text-text-primary',
    muted: 'text-text-muted',
    accent: 'text-text-accent',
  }[color];

  return (
    <p
      className={`${colorClass} text-sm ${LEADING_CLASS_MAP[leading] || LEADING_CLASS_MAP.normal} ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
}

interface MutedTextProps {
  children: ReactNode;
  className?: string;
}

export function MutedText({
  children,
  className = '',
  ...props
}: PolymorphicComponentProp<'p', MutedTextProps>) {
  return (
    <p
      className={`text-sm text-text-muted ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

interface AccentLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function AccentLink({
  to,
  children,
  className = '',
  iconLeft,
  iconRight,
  ...props
}: AccentLinkProps & Omit<ComponentPropsWithoutRef<typeof RouterLink>, 'to'>) {
  return (
    <RouterLink
      to={to}
      className={`inline-flex items-center gap-1.5 text-[var(--color-brand-accent)] hover:text-[var(--color-interactive-hover)] hover:underline transition-colors ${className}`}
      {...props}
    >
      {iconLeft && <span>{iconLeft}</span>}
      {children}
      {iconRight && <span>{iconRight}</span>}
    </RouterLink>
  );
}

interface TagProps {
  children: ReactNode;
  className?: string;
  colorScheme?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function Tag({ children, className = '', colorScheme = 'primary' }: TagProps) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/30',
    success: 'bg-[var(--color-status-success)]/20 text-[var(--color-status-success)] border border-[var(--color-status-success)]/30',
    warning: 'bg-[var(--color-status-warning)]/20 text-[var(--color-status-warning)] border border-[var(--color-status-warning)]/30',
    error: 'bg-[var(--color-status-error)]/20 text-[var(--color-status-error)] border border-[var(--color-status-error)]/30',
    info: 'bg-[var(--color-status-info)]/20 text-[var(--color-status-info)] border border-[var(--color-status-info)]/30',
  };
  const baseStyles = 'inline-flex items-center text-xs rounded-full font-medium px-2.5 py-0.5';

  return (
    <span className={`${baseStyles} ${colorClasses[colorScheme] || colorClasses.primary} ${className}`}>
      {children}
    </span>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    default: 'bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)]',
    secondary: 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border border-[var(--color-surface-border)]',
    success: 'bg-[var(--color-status-success)] text-white',
    warning: 'bg-[var(--color-status-warning)] text-[var(--color-text-primary)]',
    danger: 'bg-[var(--color-status-error)] text-white',
    info: 'bg-[var(--color-status-info)] text-white',
  };
  const baseStyles = 'inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full';

  return (
    <span className={`${baseStyles} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
}
