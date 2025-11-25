import React, { useState, useEffect, useCallback } from 'react';

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
}

export interface RatingAPI {
  getRatingStats: (itemId: string, itemType: 'blog' | 'case') => Promise<RatingStats | null>;
  submitRating: (
    itemId: string,
    itemType: 'blog' | 'case',
    rating: number
  ) => Promise<{ success: boolean; stats: RatingStats } | null>;
  getUserRating: (itemId: string, itemType: 'blog' | 'case') => Promise<number | null>;
}

export interface AggregateRatingProps {
  /** Item ID (blog slug or case ID) */
  itemId: string;
  /** Item type */
  itemType: 'blog' | 'case';
  /** Rating API functions */
  ratingAPI: RatingAPI;
  /** Star color (Tailwind class) */
  starColor?: 'yellow-400' | 'violet-400' | 'blue-400' | 'emerald-400';
  /** Optional callback when user rates */
  onRate?: (rating: number, stats: RatingStats) => void;
  /** Size of stars */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const starColorClasses: Record<
  NonNullable<AggregateRatingProps['starColor']>,
  { ring: string; hex: string }
> = {
  'yellow-400': { ring: 'focus:ring-yellow-400/60', hex: '#facc15' },
  'violet-400': { ring: 'focus:ring-violet-400/60', hex: '#c084fc' },
  'blue-400': { ring: 'focus:ring-blue-400/60', hex: '#38bdf8' },
  'emerald-400': { ring: 'focus:ring-emerald-400/60', hex: '#34d399' },
};

/**
 * Amazon-style aggregate rating component
 * Shows average rating, total count, and allows users to submit ratings
 */
export const AggregateRating: React.FC<AggregateRatingProps> = ({
  itemId,
  itemType,
  ratingAPI,
  starColor = 'yellow-400',
  onRate,
  size = 'md',
}) => {
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial data
  const refreshStats = useCallback(async () => {
    try {
      const [statsData, userRatingData] = await Promise.all([
        ratingAPI.getRatingStats(itemId, itemType),
        ratingAPI.getUserRating(itemId, itemType),
      ]);
      setStats(statsData);
      setUserRating(userRatingData);
    } catch (error) {
      console.error('Error fetching rating data:', error);
    }
  }, [itemId, itemType, ratingAPI]);

  useEffect(() => {
    setLoading(true);
    void refreshStats().finally(() => setLoading(false));
  }, [refreshStats]);

  const handleStarClick = async (rating: number) => {
    if (submitting) return;

    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage('Saving your rating…');
    try {
      const result = await ratingAPI.submitRating(itemId, itemType, rating);
      if (result && result.success) {
        setStatusMessage('Thanks! Rating saved.');
        onRate?.(rating, result.stats);
        await refreshStats();
      } else {
        setErrorMessage('Could not save your rating. Please try again.');
        setStatusMessage(null);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage('Something went wrong saving your rating.');
      setStatusMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStar = (index: number) => {
    const isHovered = hoveredStar !== null && index <= hoveredStar;
    const isUserRated = userRating !== null && index <= userRating;
    const fillColor = isHovered || isUserRated ? starColorClasses[starColor].hex : '#94a3b8';
    const ringClass = starColorClasses[starColor].ring;

    return (
      <button
        key={index}
        onClick={() => void handleStarClick(index)}
        onMouseEnter={() => setHoveredStar(index)}
        onMouseLeave={() => setHoveredStar(null)}
        disabled={submitting}
        type="button"
        className={`${sizeClasses[size]} transition-all duration-150 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringClass}`}
        aria-label={`Rate ${index} stars`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-colors duration-150 fill-current"
          style={{ color: fillColor }}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    );
  };

  const renderAggregateStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const accentColor = starColorClasses[starColor].hex;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} fill-current`}
            style={{ color: accentColor }}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <div key={i} className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${sizeClasses[size]} text-gray-300 fill-current`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${sizeClasses[size]} fill-current`}
                style={{ color: accentColor }}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} text-gray-300 fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${sizeClasses[size]} bg-gray-300 rounded`} />
          ))}
        </div>
        <div className={`${textSizeClasses[size]} text-text-muted`}>Loading ratings...</div>
      </div>
    );
  }

  const hasRatings = stats && stats.total_ratings > 0;

  return (
    <div className="space-y-4">
      {/* Aggregate Display */}
      {hasRatings && (
        <div className="flex items-center gap-3">
          <div className="flex gap-1">{renderAggregateStars(stats.average_rating)}</div>
          <div className={`${textSizeClasses[size]} font-semibold text-text-primary`}>
            {stats.average_rating.toFixed(1)}
          </div>
          <div className={`${textSizeClasses[size]} text-text-muted`}>
            ({stats.total_ratings} {stats.total_ratings === 1 ? 'rating' : 'ratings'})
          </div>
        </div>
      )}

      {/* User Rating Section */}
      <div>
        <h4 className={`${textSizeClasses[size]} font-semibold mb-2 text-text-primary`}>
          {userRating ? 'Your rating' : 'Rate this ' + itemType}
        </h4>
        <div className="flex gap-1" aria-live="polite">
          {[1, 2, 3, 4, 5].map((i) => renderStar(i))}
        </div>
        {userRating && (
          <p className={`${textSizeClasses[size]} text-text-muted mt-2`}>
            You rated this {userRating} star{userRating !== 1 ? 's' : ''}
          </p>
        )}
        {statusMessage && (
          <p className={`${textSizeClasses[size]} text-text-muted mt-2`} role="status">
            {statusMessage}
          </p>
        )}
        {errorMessage && (
          <p className={`${textSizeClasses[size]} text-red-400 mt-2`} role="alert">
            {errorMessage}
          </p>
        )}
      </div>

      {/* No Ratings Yet */}
      {!hasRatings && !userRating && (
        <p className={`${textSizeClasses[size]} text-text-muted italic`}>
          Be the first to rate this {itemType}!
        </p>
      )}
    </div>
  );
};
