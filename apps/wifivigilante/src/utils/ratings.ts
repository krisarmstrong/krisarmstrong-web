// src/utils/ratings.ts
import { supabase } from '../supabaseClient';

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
  const { data, error } = await supabase.rpc('get_rating_stats', {
    p_item_id: itemId,
    p_item_type: itemType,
  });

  if (error) {
    console.error('Error fetching rating stats:', error);
    return null;
  }

  // Handle empty result (no ratings yet)
  if (!data || data.length === 0 || !data[0].average_rating) {
    return { average_rating: 0, total_ratings: 0 };
  }

  return {
    average_rating: parseFloat(data[0].average_rating),
    total_ratings: parseInt(data[0].total_ratings, 10),
  };
}

/**
 * Submit or update a rating for an item
 */
export async function submitRating(
  itemId: string,
  itemType: 'blog' | 'case',
  rating: number
): Promise<RatingSubmitResponse | null> {
  const userFingerprint = getUserFingerprint();

  const { data, error } = await supabase.rpc('submit_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_rating: rating,
    p_user_fingerprint: userFingerprint,
  });

  if (error) {
    console.error('Error submitting rating:', error);
    return null;
  }

  return data as RatingSubmitResponse;
}

/**
 * Get the current user's rating for an item
 */
export async function getUserRating(
  itemId: string,
  itemType: 'blog' | 'case'
): Promise<number | null> {
  const userFingerprint = getUserFingerprint();

  const { data, error } = await supabase.rpc('get_user_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_user_fingerprint: userFingerprint,
  });

  if (error) {
    console.error('Error fetching user rating:', error);
    return null;
  }

  return data;
}
