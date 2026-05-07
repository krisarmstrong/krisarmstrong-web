import blogPostMetadata from '../content/blog/blog-posts.json';

const markdownFiles = import.meta.glob('../content/blog/posts/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

interface BlogPostMetadata {
  id: string;
  title: string;
  excerpt: string;
  contentFile: string;
  author: string;
  date: string;
  published?: boolean;
  featured: boolean;
  read_time?: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
}

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

// Simple in-memory cache for blog data
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const blogCache = {
  posts: null as CacheEntry<BlogPost[]> | null,
  tags: null as CacheEntry<string[]> | null,
  TTL: 300000, // 5 minutes

  get<T>(key: 'posts' | 'tags'): T | null {
    const entry = this[key] as CacheEntry<T> | null;
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.TTL) {
      this[key] = null;
      return null;
    }
    return entry.data;
  },

  setPosts(data: BlogPost[]): void {
    this.posts = { data, timestamp: Date.now() };
  },

  setTags(data: string[]): void {
    this.tags = { data, timestamp: Date.now() };
  },

  invalidate(): void {
    this.posts = null;
    this.tags = null;
  },
};

/**
 * Validate blog slug format
 * Slugs should only contain lowercase letters, numbers, and hyphens
 */
function validateSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  // Allow alphanumeric, hyphens, max 200 chars
  return /^[a-z0-9-]+$/.test(slug) && slug.length <= 200;
}

function getMarkdownContent(contentFile: string): string {
  const path = Object.keys(markdownFiles).find((filePath) => filePath.endsWith(`/${contentFile}`));
  return path ? String(markdownFiles[path]) : '';
}

function getStoredViewCount(slug: string): number {
  try {
    const counts = JSON.parse(localStorage.getItem('krisarmstrong_view_counts') || '{}') as Record<
      string,
      number
    >;
    return counts[slug] ?? 0;
  } catch {
    return 0;
  }
}

function toBlogPost(post: BlogPostMetadata): BlogPost {
  const content = getMarkdownContent(post.contentFile);
  const readTime =
    post.read_time ?? Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

  return {
    id: post.id,
    slug: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content,
    author: post.author,
    date: post.date,
    published: post.published ?? true,
    featured: post.featured,
    read_time: readTime,
    tags: post.tags,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    og_image: post.og_image,
    view_count: getStoredViewCount(post.id),
    created_at: post.date,
    updated_at: post.date,
  };
}

function normalizeBlogPost(post: BlogPost): BlogPost {
  return {
    ...post,
    published: post.published ?? true,
    featured: Boolean(post.featured),
    read_time: Number(post.read_time ?? 5),
    tags: Array.isArray(post.tags) ? post.tags : [],
    view_count: Number(post.view_count ?? 0),
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function getBundledPosts(): BlogPost[] {
  return (blogPostMetadata as BlogPostMetadata[])
    .map(toBlogPost)
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Fetch all published blog posts (cached for 5 minutes)
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Check cache first
  const cached = blogCache.get<BlogPost[]>('posts');
  if (cached) return cached;

  const apiPosts = await fetchJson<BlogPost[]>('/api/posts');
  const posts = (apiPosts?.length ? apiPosts.map(normalizeBlogPost) : getBundledPosts())
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  blogCache.setPosts(posts);
  return posts;
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Validate slug format before querying
  if (!validateSlug(slug)) {
    console.error('Invalid slug format:', slug);
    return null;
  }

  const apiPost = await fetchJson<BlogPost>(`/api/posts/${encodeURIComponent(slug)}`);
  if (apiPost) return normalizeBlogPost(apiPost);

  return getBundledPosts().find((post) => post.slug === slug) ?? null;
}

// Fetch featured blog posts
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => post.featured);
}

// Get all unique tags (cached for 5 minutes)
export async function getAllTags(): Promise<string[]> {
  // Check cache first
  const cached = blogCache.get<string[]>('tags');
  if (cached) return cached;

  const tagsSet = new Set<string>();
  const posts = await getAllBlogPosts();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagsSet.add(tag);
    }
  }

  const tags = Array.from(tagsSet).sort();
  blogCache.setTags(tags);
  return tags;
}

// Simple rate limiter for view count increments
const viewCountLimiter = {
  requests: new Map<string, number>(),
  maxRequests: 1, // 1 view per slug per minute per user session
  timeWindowMs: 60000,

  checkLimit(slug: string): boolean {
    const now = Date.now();
    const lastRequest = this.requests.get(slug);

    if (lastRequest && now - lastRequest < this.timeWindowMs) {
      return false; // Rate limited
    }

    this.requests.set(slug, now);
    return true;
  },
};

// Increment view count (rate-limited to prevent abuse)
export async function incrementViewCount(slug: string): Promise<void> {
  // Validate slug format
  if (!validateSlug(slug)) {
    console.error('Invalid slug format for view count:', slug);
    return;
  }

  // Rate limit: only allow 1 view per slug per minute per session
  if (!viewCountLimiter.checkLimit(slug)) {
    // Silently ignore - user already viewed this post recently
    return;
  }

  try {
    const counts = JSON.parse(localStorage.getItem('krisarmstrong_view_counts') || '{}') as Record<
      string,
      number
    >;
    counts[slug] = (counts[slug] ?? 0) + 1;
    localStorage.setItem('krisarmstrong_view_counts', JSON.stringify(counts));
    blogCache.invalidate();
  } catch {
    // Ignore localStorage failures. Views are informational only.
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
  const userFingerprint = getUserFingerprint();
  const apiStats = await fetchJson<RatingStats>(
    `/api/ratings?itemId=${encodeURIComponent(itemId)}&itemType=${encodeURIComponent(itemType)}&userFingerprint=${encodeURIComponent(userFingerprint)}`
  );
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
  localStorage.setItem('krisarmstrong_user_ratings', JSON.stringify(userRatings));
  localStorage.setItem(
    'krisarmstrong_rating_stats',
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
  const apiStats = await fetchJson<{ user_rating?: number | null }>(
    `/api/ratings?itemId=${encodeURIComponent(itemId)}&itemType=${encodeURIComponent(itemType)}&userFingerprint=${encodeURIComponent(userFingerprint)}`
  );
  if (apiStats && 'user_rating' in apiStats) {
    return apiStats.user_rating ?? null;
  }

  return getStoredUserRatings()[getRatingKey(itemId, itemType)] ?? null;
}

function getRatingKey(itemId: string, itemType: 'blog' | 'case'): string {
  return `${itemType}:${itemId}:${getUserFingerprint()}`;
}

function getStatsKey(itemId: string, itemType: 'blog' | 'case'): string {
  return `${itemType}:${itemId}`;
}

function getStoredRatingStats(): Record<string, { total: number; count: number }> {
  return readStorageRecord('krisarmstrong_rating_stats');
}

function getStoredRatings(
  itemId: string,
  itemType: 'blog' | 'case'
): { total: number; count: number } | null {
  return getStoredRatingStats()[getStatsKey(itemId, itemType)] ?? null;
}

function getStoredUserRatings(): Record<string, number> {
  return readStorageRecord('krisarmstrong_user_ratings');
}

function readStorageRecord<T>(key: string): Record<string, T> {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, T>;
  } catch {
    return {};
  }
}
