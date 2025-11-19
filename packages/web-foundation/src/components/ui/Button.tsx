import type { MouseEvent, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const baseClasses =
  'inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-base',
} as const;

// Theme-aware variants using CSS variables
const variantClasses = {
  primary: 'bg-[var(--color-interactive-default)] hover:bg-[var(--color-interactive-hover)] text-[var(--color-text-inverse)] focus:ring-[var(--color-interactive-focus)]',
  secondary: 'bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-surface-border)] focus:ring-[var(--color-interactive-focus)]',
  danger: 'bg-[var(--color-status-error)] hover:bg-[var(--color-status-error)]/90 text-white focus:ring-[var(--color-status-error)]',
  warning: 'bg-[var(--color-status-warning)] hover:bg-[var(--color-status-warning)]/90 text-[var(--color-text-primary)] focus:ring-[var(--color-status-warning)]',
  success: 'bg-[var(--color-status-success)] hover:bg-[var(--color-status-success)]/90 text-white focus:ring-[var(--color-status-success)]',
  outline: 'border border-[var(--color-surface-border)] bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] focus:ring-[var(--color-interactive-focus)]',
  ghost: 'bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] focus:ring-[var(--color-interactive-focus)]',
} as const;

type Size = keyof typeof sizeClasses;
type Variant = keyof typeof variantClasses;

interface BaseButtonProps {
  /** Visual variant of the button - automatically adapts to theme */
  variant?: Variant;
  /** Size of the button */
  size?: Size;
  /** @deprecated Use variant instead. This prop is maintained for backwards compatibility. */
  tone?: 'blue' | 'violet' | 'sage' | 'emerald';
  /** Show loading spinner */
  isLoading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Icon to show before the button text */
  leftIcon?: ReactNode;
  /** Icon to show after the button text */
  rightIcon?: ReactNode;
  /** Button content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: 'button';
  to?: never;
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

interface ButtonAsLink extends BaseButtonProps {
  as: 'Link';
  to: string;
  href?: never;
  type?: never;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

interface ButtonAsAnchor extends BaseButtonProps {
  as: 'a';
  to?: string;
  href?: string;
  type?: never;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const Spinner = ({ className = '' }: { className?: string }) => (
  <svg
    className={`h-4 w-4 animate-spin text-current ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export function Button({
  as: ComponentType = 'button',
  to,
  variant = 'primary',
  size = 'md',
  tone, // Deprecated, keeping for backwards compatibility
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass = variantClasses[variant];
  const classList = `${baseClasses} ${sizeClasses[size]} ${variantClass} ${className}`;

  if (ComponentType === 'Link') {
    if (!to) {
      throw new Error('Button with as="Link" must have a "to" prop');
    }
    return (
      <RouterLink
        to={to}
        className={classList}
        {...(props as Omit<React.ComponentProps<typeof RouterLink>, 'to'>)}
      >
        {isLoading && <Spinner className={children ? 'mr-2' : ''} />}
        {!isLoading && leftIcon && (
          <span className={children ? 'mr-1.5 -ml-0.5' : ''}>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className={children ? 'ml-1.5 -mr-0.5' : ''}>{rightIcon}</span>
        )}
      </RouterLink>
    );
  }

  if (ComponentType === 'a') {
    const anchorProps = props as ButtonAsAnchor;
    const href = anchorProps.href || to;
    return (
      <a href={href} className={classList} {...anchorProps}>
        {isLoading && <Spinner className={children ? 'mr-2' : ''} />}
        {!isLoading && leftIcon && (
          <span className={children ? 'mr-1.5 -ml-0.5' : ''}>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className={children ? 'ml-1.5 -mr-0.5' : ''}>{rightIcon}</span>
        )}
      </a>
    );
  }

  return (
    <button
      className={classList}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {isLoading && (
        <>
          <Spinner className={children ? 'mr-2' : ''} />
          <span className="sr-only">Loading...</span>
        </>
      )}
      {!isLoading && leftIcon && (
        <span className={children ? 'mr-1.5 -ml-0.5' : ''}>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className={children ? 'ml-1.5 -mr-0.5' : ''}>{rightIcon}</span>
      )}
    </button>
  );
}
