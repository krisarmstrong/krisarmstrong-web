import { ReactNode } from 'react';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
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
}: ContentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article
      className={`flex flex-col bg-gray-900 rounded-2xl p-6 border border-gray-800 ${accentColors[accentColor]} hover:shadow-lg transition-all duration-300 group ${className}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Badges Row */}
      <div className="flex gap-2 mb-3 flex-wrap">
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

      {/* Title - Clickable */}
      <Link to={href}>
        <h2 className={`text-2xl font-bold mb-3 transition-colors ${accentTextColors[accentColor]}`}>
          {title}
        </h2>
      </Link>

      {/* Metadata (Sector, Subsector, Tool, etc.) */}
      {metadata && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          {metadataIcon}
          <span>{metadata}</span>
        </div>
      )}

      {/* Excerpt */}
      <p className="text-gray-400 mb-4 flex-grow line-clamp-3">{excerpt}</p>

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
    </article>
  );
}
