import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ServiceCardVariant = 'violet' | 'blue' | 'sage';

interface ServiceCardProps {
  /** Card title */
  title: string;
  /** Card subtitle/tagline */
  subtitle: string;
  /** Card description */
  description: string;
  /** Highlights list */
  highlights?: string[];
  /** Quote/testimonial */
  quote?: string;
  /** CTA button text */
  ctaText: string;
  /** CTA button link */
  ctaLink: string;
  /** Color variant */
  variant?: ServiceCardVariant;
  /** Custom className */
  className?: string;
  /** Optional icon or decorative element */
  icon?: ReactNode;
}

const variantColors: Record<ServiceCardVariant, { border: string; accent: string; button: string }> = {
  violet: {
    border: 'border-violet-400/30 hover:border-violet-400',
    accent: 'bg-violet-400',
    button: 'bg-violet-400 text-gray-900 hover:opacity-90',
  },
  blue: {
    border: 'border-blue-400/30 hover:border-blue-400',
    accent: 'bg-blue-400',
    button: 'bg-blue-400 text-gray-900 hover:opacity-90',
  },
  sage: {
    border: 'border-green-400/30 hover:border-green-400',
    accent: 'bg-green-400',
    button: 'bg-green-400 text-gray-900 hover:opacity-90',
  },
};

/**
 * ServiceCard - Card component for services, offerings, or product tiers
 * Matches intrinsic momentum mindset service card styling
 */
export function ServiceCard({
  title,
  subtitle,
  description,
  highlights = [],
  quote,
  ctaText,
  ctaLink,
  variant = 'violet',
  className = '',
  icon,
}: ServiceCardProps) {
  const colors = variantColors[variant];

  return (
    <div
      className={`border-2 ${colors.border} rounded-2xl p-8 transition-colors bg-surface shadow-sm flex flex-col ${className}`}
    >
      {/* Decorative Accent Bar */}
      <div className={`h-2 w-16 ${colors.accent} rounded mb-6`}></div>

      {/* Icon (optional) */}
      {icon && <div className="mb-4">{icon}</div>}

      {/* Title */}
      <h2 className="text-2xl font-heading mb-4 text-text-main">{title}</h2>

      {/* Subtitle */}
      <h3 className="text-lg font-semibold text-text-main mb-3">{subtitle}</h3>

      {/* Description */}
      <p className="text-text-muted mb-4 leading-relaxed">{description}</p>

      {/* Highlights */}
      {highlights.length > 0 && (
        <>
          <p className={`text-sm font-semibold ${colors.accent === 'bg-violet-400' ? 'text-violet-400' : colors.accent === 'bg-blue-400' ? 'text-blue-400' : 'text-green-400'} mb-3`}>
            Highlights:
          </p>
          <ul className="space-y-2 text-text-muted mb-4 text-sm">
            {highlights.map((highlight, index) => (
              <li key={index}>• {highlight}</li>
            ))}
          </ul>
        </>
      )}

      {/* Quote */}
      {quote && (
        <p className={`text-sm italic text-text-muted mb-6 border-l-4 ${colors.accent} pl-4`}>
          "{quote}"
        </p>
      )}

      {/* CTA Button */}
      <Link
        to={ctaLink}
        className={`inline-block w-full ${colors.button} font-semibold py-3 rounded-lg transition-opacity text-center mt-auto`}
      >
        {ctaText}
      </Link>
    </div>
  );
}
