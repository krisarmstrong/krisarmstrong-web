-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Kris Armstrong',
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  read_time INTEGER,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING GIN(to_tsvector('english', title || ' ' || excerpt || ' ' || content));

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS blog_posts_select_policy ON blog_posts;
DROP POLICY IF EXISTS blog_posts_insert_policy ON blog_posts;
DROP POLICY IF EXISTS blog_posts_update_policy ON blog_posts;

-- Create policy for public read access to published posts
CREATE POLICY blog_posts_select_policy
  ON blog_posts
  FOR SELECT
  USING (published = true);

-- Create policy for authenticated users to insert/update (optional, for future admin panel)
CREATE POLICY blog_posts_insert_policy
  ON blog_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY blog_posts_update_policy
  ON blog_posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');
