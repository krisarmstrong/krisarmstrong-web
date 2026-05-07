// src/utils/ratings.ts
// ============================================
// AGGREGATE RATINGS FUNCTIONS
// ============================================

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
}

export interface RatingSubmitResponse {
  success: boolean;
  rating: number;
  stats: RatingStats;
}

/**
 * Generate a browser fingerprint for user identification
 * Uses multiple browser characteristics to create a unique ID
 */
export function getUserFingerprint(): string {
  // Check if fingerprint exists in localStorage
  const stored = localStorage.getItem('user_fingerprint');
  if (stored) return stored;

  // Generate new fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const txt = 'fingerprint';

  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText(txt, 4, 17);
  }

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ]
    .join('|')
    .split('')
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)
    .toString(36);

  // Store fingerprint
  localStorage.setItem('user_fingerprint', fingerprint);
  return fingerprint;
}

/**
 * Get aggregate rating statistics for an item
 */
export async function getRatingStats(
  itemId: string,
  itemType: 'blog' | 'case'
): Promise<RatingStats | null> {
  const userFingerprint = getUserFingerprint();
  const apiStats = await fetchRatingStats(itemId, itemType, userFingerprint);
  if (apiStats) {
    return {
      average_rating: Number(apiStats.average_rating ?? 0),
      total_ratings: Number(apiStats.total_ratings ?? 0),
    };
  }

  const ratings = getStoredRatings(itemId, itemType);
  if (!ratings || ratings.count === 0) {
    return { average_rating: 0, total_ratings: 0 };
  }

  return {
    average_rating: ratings.total / ratings.count,
    total_ratings: ratings.count,
  };
}

/**
 * Validate rating value is within acceptable range
 */
function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Submit or update a rating for an item
 */
export async function submitRating(
  itemId: string,
  itemType: 'blog' | 'case',
  rating: number
): Promise<RatingSubmitResponse | null> {
  // Validate rating before sending to server
  if (!validateRating(rating)) {
    console.error('Invalid rating value:', rating);
    return null;
  }

  const previousRating = await getUserRating(itemId, itemType);
  const userFingerprint = getUserFingerprint();

  try {
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ itemId, itemType, rating, userFingerprint }),
    });
    if (response.ok) {
      return (await response.json()) as RatingSubmitResponse;
    }
  } catch {
    // Fall back to browser-local ratings when the API is unavailable in local static dev.
  }

  const ratings = getStoredRatings(itemId, itemType) ?? { total: 0, count: 0 };
  const nextRatings =
    previousRating === null
      ? { total: ratings.total + rating, count: ratings.count + 1 }
      : { total: ratings.total - previousRating + rating, count: ratings.count };
  const userRatings = getStoredUserRatings();

  userRatings[getRatingKey(itemId, itemType)] = rating;
  localStorage.setItem('wifivigilante_user_ratings', JSON.stringify(userRatings));
  localStorage.setItem(
    'wifivigilante_rating_stats',
    JSON.stringify({
      ...getStoredRatingStats(),
      [getStatsKey(itemId, itemType)]: nextRatings,
    })
  );

  return {
    success: true,
    rating,
    stats: {
      average_rating: nextRatings.total / nextRatings.count,
      total_ratings: nextRatings.count,
    },
  };
}

/**
 * Get the current user's rating for an item
 */
export async function getUserRating(
  itemId: string,
  itemType: 'blog' | 'case'
): Promise<number | null> {
  const userFingerprint = getUserFingerprint();
  const apiStats = await fetchRatingStats(itemId, itemType, userFingerprint);
  if (apiStats && 'user_rating' in apiStats) {
    return apiStats.user_rating ?? null;
  }

  return getStoredUserRatings()[getRatingKey(itemId, itemType)] ?? null;
}

async function fetchRatingStats(
  itemId: string,
  itemType: 'blog' | 'case',
  userFingerprint: string
): Promise<(RatingStats & { user_rating?: number | null }) | null> {
  try {
    const response = await fetch(
      `/api/ratings?itemId=${encodeURIComponent(itemId)}&itemType=${encodeURIComponent(itemType)}&userFingerprint=${encodeURIComponent(userFingerprint)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!response.ok) return null;
    return (await response.json()) as RatingStats & { user_rating?: number | null };
  } catch {
    return null;
  }
}

function getRatingKey(itemId: string, itemType: 'blog' | 'case'): string {
  return `${itemType}:${itemId}:${getUserFingerprint()}`;
}

function getStatsKey(itemId: string, itemType: 'blog' | 'case'): string {
  return `${itemType}:${itemId}`;
}

function getStoredRatingStats(): Record<string, { total: number; count: number }> {
  return readStorageRecord('wifivigilante_rating_stats');
}

function getStoredRatings(
  itemId: string,
  itemType: 'blog' | 'case'
): { total: number; count: number } | null {
  return getStoredRatingStats()[getStatsKey(itemId, itemType)] ?? null;
}

function getStoredUserRatings(): Record<string, number> {
  return readStorageRecord('wifivigilante_user_ratings');
}

function readStorageRecord<T>(key: string): Record<string, T> {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, T>;
  } catch {
    return {};
  }
}
