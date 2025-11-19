import { ReactNode, useState, useEffect } from 'react';
import { Calendar, Clock, Tag as TagIcon, Bookmark, Share2, User } from 'lucide-react';
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
  accentColor?: 'violet' | 'blue' | 'green' | 'red' | 'yellow';
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
};

const accentTextColors = {
  violet: 'group-hover:text-violet-400',
  blue: 'group-hover:text-blue-400',
  green: 'group-hover:text-green-400',
  red: 'group-hover:text-red-400',
  yellow: 'group-hover:text-yellow-400',
};

const tagHoverColors = {
  violet: 'hover:bg-violet-500',
  blue: 'hover:bg-blue-500',
  green: 'hover:bg-green-500',
  red: 'hover:bg-red-500',
  yellow: 'hover:bg-yellow-500',
};

const bookmarkActiveColors = {
  violet: 'bg-violet-500/20 text-violet-400',
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  red: 'bg-red-500/20 text-red-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
};

const progressBarColors = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
};

/**
 * ContentCard - Reusable card component for blog posts, cases, or any content
 * Provides consistent styling across projects with customizable accent colors
 */
export function ContentCard({
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
  author,
  authorAvatar,
  variant = 'default',
  isLoading = false,
  progress,
  isBookmarked: initialIsBookmarked = false,
  onBookmark,
  onShare,
}: ContentCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  // Sync bookmark state with props
  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <article
        className={`flex flex-col bg-gray-900 rounded-2xl p-6 border border-gray-800 ${className}`}
        aria-busy="true"
        aria-label="Loading content card"
      >
        {image && <div className="w-full h-48 bg-gray-800 rounded-xl mb-4 animate-pulse" />}
        <div className="h-8 bg-gray-800 rounded mb-3 animate-pulse w-3/4" />
        <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse" />
        <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse w-5/6" />
        <div className="h-4 bg-gray-800 rounded mb-4 animate-pulse w-2/3" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-800 rounded-full animate-pulse w-16" />
          <div className="h-6 bg-gray-800 rounded-full animate-pulse w-16" />
        </div>
      </article>
    );
  }

  const variantStyles = {
    default: 'p-6',
    compact: 'p-4 flex-row gap-4',
    expanded: 'p-8',
  };

  return (
    <article
      className={`relative flex bg-gray-900 rounded-2xl border border-gray-800 ${accentColors[accentColor]} hover:shadow-lg transition-all duration-300 group ${variantStyles[variant]} ${variant === 'compact' ? 'flex-row' : 'flex-col'} ${className}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Progress Bar */}
      {progress !== undefined && progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t-2xl overflow-hidden">
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

      {/* Image Thumbnail */}
      {image && (
        <Link to={href} className={variant === 'compact' ? 'w-1/3 flex-shrink-0' : 'w-full'}>
          <img
            src={image}
            alt={imageAlt || title}
            className={`object-cover rounded-xl ${variant === 'compact' ? 'h-full' : 'h-48 w-full mb-4'}`}
          />
        </Link>
      )}

      <div className="flex flex-col flex-grow">
        {/* Header with Badges and Actions */}
        <div className="flex justify-between items-start gap-2 mb-3">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {featured && (
              <span className="inline-block px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full">
                Featured
              </span>
            )}
            {severity && (
              <span className={`inline-block px-3 py-1 text-sm rounded-full border ${severityColors[severity]}`}>
                {severity}
              </span>
            )}
            {status && (
              <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                {status}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {(onBookmark || onShare) && (
            <div className="flex gap-2">
              {onBookmark && (
                <button
                  onClick={handleBookmarkClick}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? bookmarkActiveColors[accentColor]
                      : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                  }`}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  aria-pressed={isBookmarked}
                >
                  <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              )}
              {onShare && (
                <button
                  onClick={handleShareClick}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title - Clickable */}
        <Link to={href}>
          <h2
            className={`${variant === 'compact' ? 'text-xl' : variant === 'expanded' ? 'text-3xl' : 'text-2xl'} font-bold mb-3 transition-colors ${accentTextColors[accentColor]}`}
          >
            {title}
          </h2>
        </Link>

        {/* Author */}
        {author && (
          <div className="flex items-center gap-2 mb-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={author}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
            )}
            <span className="text-sm text-gray-400">{author}</span>
          </div>
        )}

        {/* Metadata (Sector, Subsector, Tool, etc.) */}
        {metadata && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            {metadataIcon}
            <span>{metadata}</span>
          </div>
        )}

        {/* Excerpt */}
        <p className={`text-gray-400 mb-4 flex-grow ${variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {excerpt}
        </p>

      {/* Meta Information (Date, Time, Duration) */}
      {(date || readTime || durationMinutes) && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(date)}</span>
            </div>
          )}
          {readTime && (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{readTime} min read</span>
            </div>
          )}
          {durationMinutes && (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{durationMinutes} min</span>
            </div>
          )}
        </div>
      )}

        {/* Tags - Clickable for filtering */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  if (onTagClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    onTagClick(tag);
                  }
                }}
                className={`inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full ${tagHoverColors[accentColor]} hover:text-white transition-colors ${onTagClick ? 'cursor-pointer' : 'cursor-default'}`}
                disabled={!onTagClick}
              >
                <TagIcon size={12} />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
