import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  published: boolean;
  featured: boolean;
  read_time: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// Fetch all published blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }

  return data || [];
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Post not found
      return null;
    }
    console.error('Error fetching blog post:', error);
    throw error;
  }

  return data;
}

// Fetch featured blog posts
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching featured blog posts:', error);
    throw error;
  }

  return data || [];
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase.from('blog_posts').select('tags').eq('published', true);

  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }

  const tagsSet = new Set<string>();
  data?.forEach((post) => {
    post.tags?.forEach((tag: string) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

// Increment view count
export async function incrementViewCount(slug: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_count', { post_slug: slug });

  if (error) {
    console.error('Error incrementing view count:', error);
  }
}

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
