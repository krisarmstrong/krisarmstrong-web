import type { MouseEvent, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const baseClasses =
  'inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed';

const sizeClasses = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-base',
} as const;

const primaryTone: Record<'blue' | 'violet' | 'sage' | 'emerald', string> = {
  blue: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  violet: 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500',
  sage: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
  emerald: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400',
};

const variantClasses = {
  secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-400',
  outline: 'border border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300 focus:ring-gray-500',
  ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 focus:ring-gray-500',
} as const;

type Size = keyof typeof sizeClasses;
type Variant = 'primary' | keyof typeof variantClasses;

interface BaseButtonProps {
  variant?: Variant;
  size?: Size;
  tone?: 'blue' | 'violet' | 'sage' | 'emerald';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
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
  tone = 'blue',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass =
    variant === 'primary' ? primaryTone[tone] : variantClasses[variant];
  const classList = `${baseClasses} ${sizeClasses[size]} ${variantClass} ${className}`;

  if (ComponentType === 'Link') {
    return (
      <RouterLink
        to={to!}
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
