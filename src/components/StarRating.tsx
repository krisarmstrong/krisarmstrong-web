import { useState, useEffect } from "react";
import { Star } from "lucide-react";

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

/**
 * Star rating component for content
 * Stores ratings in localStorage and displays average rating
 * Can be used for blog posts, cases, or any ratable content
 */
export function StarRating({
  itemId,
  storagePrefix = 'content',
  onRate,
  starColor = 'yellow-400',
  starSize = 24
}: StarRatingProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  useEffect(() => {
    // Load ratings from localStorage
    const ratingsKey = `${storagePrefix}-ratings-${itemId}`;
    const userRatingKey = `${storagePrefix}-user-rating-${itemId}`;

    const storedRatings = localStorage.getItem(ratingsKey);
    const storedUserRating = localStorage.getItem(userRatingKey);

    if (storedRatings) {
      const { total, count } = JSON.parse(storedRatings);
      setAverageRating(count > 0 ? total / count : 0);
      setTotalRatings(count);
    }

    if (storedUserRating) {
      setUserRating(parseInt(storedUserRating, 10));
    }
  }, [itemId, storagePrefix]);

  const handleRate = (rating: number) => {
    const ratingsKey = `${storagePrefix}-ratings-${itemId}`;
    const userRatingKey = `${storagePrefix}-user-rating-${itemId}`;

    // Get existing ratings
    const storedRatings = localStorage.getItem(ratingsKey);
    let total = 0;
    let count = 0;

    if (storedRatings) {
      const parsed = JSON.parse(storedRatings);
      total = parsed.total;
      count = parsed.count;
    }

    // If user already rated, subtract their old rating
    if (userRating > 0) {
      total -= userRating;
      count -= 1;
    }

    // Add new rating
    total += rating;
    count += 1;

    // Save to localStorage
    localStorage.setItem(ratingsKey, JSON.stringify({ total, count }));
    localStorage.setItem(userRatingKey, rating.toString());

    // Update state
    setUserRating(rating);
    setAverageRating(total / count);
    setTotalRatings(count);

    // Callback
    if (onRate) {
      onRate(rating);
    }
  };

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
                    isFilled
                      ? `fill-${starColor} text-${starColor}`
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
        {userRating > 0 && (
          <span className="text-sm text-gray-400">
            You rated: {userRating}/5
          </span>
        )}
      </div>

      {/* Rating stats */}
      {totalRatings > 0 && (
        <div className="text-sm text-gray-500">
          Average: {averageRating.toFixed(1)}/5 ({totalRatings}{" "}
          {totalRatings === 1 ? "rating" : "ratings"})
        </div>
      )}

      {/* Instructions */}
      {userRating === 0 && (
        <p className="text-xs text-gray-500">
          Click to rate
        </p>
      )}
    </div>
  );
}
