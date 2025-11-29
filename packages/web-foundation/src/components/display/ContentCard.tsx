import { ReactNode, memo } from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ContentCardProps {
  /** URL to navigate to when card is clicked */
  href: string;
  /** Card title */
  title: string;
  /** Card excerpt/summary */
  excerpt: string;
  /** Optional date to display */
  date?: string;
  /** Optional read time in minutes */
  readTime?: number;
  /** Optional duration in minutes */
  durationMinutes?: number;
  /** Array of tags */
  tags?: string[];
  /** Callback when tag is clicked */
  onTagClick?: (tag: string) => void;
  /** Optional featured badge */
  featured?: boolean;
  /** Optional metadata items to display (e.g., "Sector • Subsector") */
  metadata?: string;
  /** Optional icon for metadata */
  metadataIcon?: ReactNode;
  /** Optional severity indicator */
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  /** Optional status */
  status?: string;
  /** Accent color for hover effects (defaults to violet) */
  accentColor?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'teal';
  /** Animation delay for stagger effect */
  animationDelay?: number;
  /** Custom className */
  className?: string;
  /** Optional image/thumbnail URL */
  image?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Author name */
  author?: string;
  /** Author avatar URL */
  authorAvatar?: string;
  /** Card variant (default, compact, expanded) */
  variant?: 'default' | 'compact' | 'expanded';
  /** Loading state */
  isLoading?: boolean;
  /** Reading progress (0-100) */
  progress?: number;
  /** Bookmark state */
  isBookmarked?: boolean;
  /** Callback when bookmark is toggled */
  onBookmark?: () => void;
  /** Callback when share is clicked */
  onShare?: () => void;
}

const severityColors = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  Low: 'bg-green-500/20 text-green-400 border-green-500/50',
};

const accentColors = {
  violet: 'hover:border-violet-500/50 hover:shadow-violet-500/10',
  blue: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
  green: 'hover:border-green-500/50 hover:shadow-green-500/10',
  red: 'hover:border-red-500/50 hover:shadow-red-500/10',
  yellow: 'hover:border-yellow-500/50 hover:shadow-yellow-500/10',
  teal: 'hover:border-teal-500/50 hover:shadow-teal-500/10',
};

const accentFocusRings = {
  violet: 'focus-visible:ring-violet-400/60',
  blue: 'focus-visible:ring-blue-400/60',
  green: 'focus-visible:ring-green-400/60',
  red: 'focus-visible:ring-red-400/60',
  yellow: 'focus-visible:ring-yellow-400/60',
  teal: 'focus-visible:ring-teal-400/60',
};

const accentTextColors = {
  violet: 'group-hover:text-violet-400',
  blue: 'group-hover:text-blue-400',
  green: 'group-hover:text-green-400',
  red: 'group-hover:text-red-400',
  yellow: 'group-hover:text-yellow-400',
  teal: 'group-hover:text-teal-400',
};

const tagHoverColors = {
  violet:
    'text-violet-200 hover:text-white hover:bg-violet-500/20 focus-visible:ring-violet-400/50',
  blue: 'text-blue-200 hover:text-white hover:bg-blue-500/20 focus-visible:ring-blue-400/50',
  green: 'text-green-200 hover:text-white hover:bg-green-500/20 focus-visible:ring-green-400/50',
  red: 'text-red-200 hover:text-white hover:bg-red-500/20 focus-visible:ring-red-400/50',
  yellow:
    'text-yellow-200 hover:text-yellow-50 hover:bg-yellow-500/20 focus-visible:ring-yellow-400/50',
  teal: 'text-teal-200 hover:text-white hover:bg-teal-500/20 focus-visible:ring-teal-400/50',
};

const progressBarColors = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  teal: 'bg-teal-500',
};

/**
 * ContentCard - Reusable card component for blog posts, cases, or any content
 * Provides consistent styling across projects with customizable accent colors
 * Wrapped with React.memo to prevent unnecessary re-renders when filtering/sorting
 */
export const ContentCard = memo(function ContentCard({
  href,
  title,
  excerpt,
  date,
  readTime,
  durationMinutes,
  tags = [],
  onTagClick,
  featured,
  metadata,
  metadataIcon,
  severity,
  status,
  accentColor = 'violet',
  animationDelay = 0,
  className = '',
  image,
  imageAlt,
  variant = 'default',
  isLoading = false,
  progress,
}: ContentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={`flex flex-col h-full bg-surface-raised rounded-2xl p-6 border border-surface-border ${className}`}
        aria-busy="true"
        aria-label="Loading content card"
      >
        {image && <div className="w-full h-48 bg-surface-hover rounded-xl mb-4 animate-pulse" />}
        <div className="h-8 bg-surface-hover rounded mb-3 animate-pulse w-3/4" />
        <div className="h-4 bg-surface-hover rounded mb-2 animate-pulse" />
        <div className="h-4 bg-surface-hover rounded mb-2 animate-pulse w-5/6" />
        <div className="h-4 bg-surface-hover rounded mb-4 animate-pulse w-2/3" />
        <div className="flex gap-2">
          <div className="h-6 bg-surface-hover rounded-full animate-pulse w-16" />
          <div className="h-6 bg-surface-hover rounded-full animate-pulse w-16" />
        </div>
      </div>
    );
  }

  const variantStyles = {
    default: 'p-6',
    compact: 'p-4 flex-row gap-4',
    expanded: 'p-8',
  };

  // Tag spacing - no mt-auto to avoid pushing to absolute bottom
  // Tags should flow naturally after content with consistent spacing
  const tagAreaSpacing =
    variant === 'compact'
      ? 'px-4 pb-4 pt-3'
      : variant === 'expanded'
        ? 'px-8 pb-8 pt-4'
        : 'px-6 pb-6 pt-4';

  return (
    <Link
      to={href}
      className={`relative flex flex-col h-full bg-surface-raised rounded-2xl border border-surface-border shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised ${accentColors[accentColor]} ${accentFocusRings[accentColor]} ${className}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Progress Bar */}
      {progress !== undefined && progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-surface-hover rounded-t-2xl overflow-hidden">
          <div
            className={`h-full ${progressBarColors[accentColor]} transition-all duration-300`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-grow ${variantStyles[variant]} ${variant === 'compact' ? 'flex-row gap-4' : 'flex-col'}`}
      >
        {/* Image Thumbnail - lazy loaded for performance */}
        {image && (
          <div className={variant === 'compact' ? 'w-1/3 flex-shrink-0' : 'w-full'}>
            <img
              src={image}
              alt={imageAlt || title}
              loading="lazy"
              decoding="async"
              className={`object-cover rounded-xl ${variant === 'compact' ? 'h-full' : 'h-48 w-full mb-4'}`}
            />
          </div>
        )}

        <div className="flex flex-col flex-grow">
          {/* Featured Badge - Small and minimal */}
          {featured && (
            <span className="inline-block px-3 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-full mb-3 self-start">
              Featured
            </span>
          )}

          {/* Title - prominent with hover effect from parent */}
          <h2
            className={`${variant === 'compact' ? 'text-lg' : variant === 'expanded' ? 'text-2xl' : 'text-xl'} font-semibold mb-3 transition-colors ${accentTextColors[accentColor]}`}
          >
            {title}
          </h2>

          {/* Excerpt */}
          <p
            className={`text-text-muted text-sm mb-4 ${variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3'}`}
          >
            {excerpt}
          </p>

          {/* Meta Information (Date, Time, Duration) */}
          {(date || readTime || durationMinutes) && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-3">
              {date && <span>{formatDate(date)}</span>}
              {readTime && <span>{readTime} min read</span>}
              {durationMinutes && <span>{durationMinutes} min</span>}
            </div>
          )}

          {/* Metadata and Badges Row */}
          {(metadata || severity || status) && (
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {metadata && (
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  {metadataIcon}
                  <span>{metadata}</span>
                </div>
              )}
              {severity && (
                <span
                  className={`inline-block px-2 py-0.5 text-xs rounded-full border ${severityColors[severity]}`}
                >
                  {severity}
                </span>
              )}
              {status && (
                <span className="inline-block px-2 py-0.5 bg-surface-hover text-text-primary text-xs rounded-full">
                  {status}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags - Clickable for filtering, uses span with role="button" to avoid nested interactive content */}
      {tags.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${tagAreaSpacing}`} aria-label="Content tags">
          {tags.map((tag) => (
            <span
              key={tag}
              role={onTagClick ? 'button' : undefined}
              tabIndex={onTagClick ? 0 : undefined}
              onClick={(e) => {
                if (onTagClick) {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick(tag);
                }
              }}
              onKeyDown={(e) => {
                if (onTagClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick(tag);
                }
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 bg-surface-hover text-text-muted text-xs rounded-full ${tagHoverColors[accentColor]} transition-colors ${onTagClick ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <TagIcon size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
});
