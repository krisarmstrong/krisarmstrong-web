import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  /** Unique identifier for the content being rated (e.g., post ID, case ID) */
  itemId: string;
  /** Optional prefix for localStorage keys (e.g., 'blog', 'case') */
  storagePrefix?: string;
  /** Callback when user rates */
  onRate?: (rating: number) => void;
  /** Custom star color when filled */
  starColor?: string;
  /** Star size */
  starSize?: number;
}

const filledStarClassMap: Record<string, string> = {
  'yellow-400': 'fill-yellow-400 text-yellow-400',
  'violet-400': 'fill-violet-400 text-violet-400',
  'blue-400': 'fill-blue-400 text-blue-400',
};

const getStorage = () => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  return window.localStorage;
};

/**
 * Star rating component for content
 * Stores ratings in localStorage (when available) and tracks user rating state.
 */
export function StarRating({
  itemId,
  storagePrefix = 'content',
  onRate,
  starColor = 'yellow-400',
  starSize = 24,
}: StarRatingProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) {
      return;
    }

    const ratingsKey = `${storagePrefix}-ratings-${itemId}`;
    const userRatingKey = `${storagePrefix}-user-rating-${itemId}`;

    try {
      const storedRatings = storage.getItem(ratingsKey);
      const storedUserRating = storage.getItem(userRatingKey);

      if (storedRatings) {
        const { total, count } = JSON.parse(storedRatings) as { total: number; count: number };
        setAverageRating(count > 0 ? total / count : 0);
        setTotalRatings(count);
      }

      if (storedUserRating) {
        setUserRating(parseInt(storedUserRating, 10));
      }
    } catch (error) {
      console.warn('Failed to read rating from storage', error);
    }
  }, [itemId, storagePrefix]);

  const persistRating = (rating: number) => {
    const storage = getStorage();
    if (!storage) {
      return { total: rating, count: 1 };
    }

    const ratingsKey = `${storagePrefix}-ratings-${itemId}`;
    const userRatingKey = `${storagePrefix}-user-rating-${itemId}`;

    let total = 0;
    let count = 0;

    try {
      const storedRatings = storage.getItem(ratingsKey);
      if (storedRatings) {
        const parsed = JSON.parse(storedRatings) as { total: number; count: number };
        total = parsed.total;
        count = parsed.count;
      }

      if (userRating > 0 && count > 0) {
        total -= userRating;
        count -= 1;
      }

      total += rating;
      count += 1;

      storage.setItem(ratingsKey, JSON.stringify({ total, count }));
      storage.setItem(userRatingKey, rating.toString());
    } catch (error) {
      console.warn('Failed to persist rating', error);
    }

    return { total, count };
  };

  const handleRate = (rating: number) => {
    const { total, count } = persistRating(rating);

    setUserRating(rating);
    setAverageRating(count > 0 ? total / count : rating);
    setTotalRatings(count);

    onRate?.(rating);
  };

  const filledClasses = filledStarClassMap[starColor] ?? filledStarClassMap['yellow-400'];

  return (
    <div className="flex flex-col gap-2">
      {/* Star buttons */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoveredStar || userRating);
            return (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  size={starSize}
                  className={`transition-colors ${
                    isFilled ? filledClasses : 'text-gray-600 hover:text-gray-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
        {userRating > 0 && <span className="text-sm text-gray-400">You rated: {userRating}/5</span>}
      </div>

      {/* Rating stats */}
      {totalRatings > 0 && (
        <div className="text-sm text-gray-500">
          Average: {averageRating.toFixed(1)}/5 ({totalRatings}{' '}
          {totalRatings === 1 ? 'rating' : 'ratings'})
        </div>
      )}

      {/* Instructions */}
      {userRating === 0 && <p className="text-xs text-gray-500">Click to rate</p>}
    </div>
  );
}
