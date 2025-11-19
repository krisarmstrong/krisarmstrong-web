import type { ReactNode } from 'react';
import type { Theme } from '../../types';
import { themeTokens } from '../../tokens';

interface CardProps {
  children: ReactNode;
  className?: string;
  theme?: Theme;
}

/**
 * Card - A container component with a raised surface and border.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the card.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {Theme} [props.theme='dark'] - The theme of the card.
 * @returns {JSX.Element} The rendered card component.
 */
export function Card({ children, className = '', theme = 'dark' }: CardProps) {
  const palette = themeTokens[theme] || themeTokens.dark;
  return (
    <div
      className={`rounded-lg border shadow-lg ${className}`}
      style={{
        backgroundColor: palette.surfaceRaised,
        borderColor: palette.border,
        color: palette.textPrimary,
      }}
    >
      {children}
    </div>
  );
}

/**
 * CardContent - A component for the content area of a Card.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the card.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The rendered card content component.
 */
export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
