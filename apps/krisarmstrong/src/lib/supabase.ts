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

// Search blog posts
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .textSearch('title', query, {
      type: 'websearch',
      config: 'english',
    })
    .order('date', { ascending: false });

  if (error) {
    console.error('Error searching blog posts:', error);
    throw error;
  }

  return data || [];
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('published', true);

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
