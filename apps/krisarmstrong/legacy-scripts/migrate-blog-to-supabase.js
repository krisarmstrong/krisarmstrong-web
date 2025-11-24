import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables.');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗ MISSING');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper function to calculate read time (words per minute)
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function createTable() {
  console.log('Creating blog_posts table...');

  // Note: Table creation via SQL is best done through Supabase Dashboard or CLI
  // This script focuses on data migration
  console.log('Please ensure the table exists in Supabase:');
  console.log('Table: blog_posts');
  console.log('Run this SQL in your Supabase SQL Editor:');
  console.log(`
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING GIN(to_tsvector('english', title || ' ' || excerpt || ' ' || content));

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY IF NOT EXISTS blog_posts_select_policy ON blog_posts FOR SELECT USING (published = true);
  `);
}

async function migrateBlogPosts() {
  console.log('\nStarting blog post migration...\n');

  // Read blog posts metadata
  const blogPostsPath = path.join(__dirname, '../src/content/blog/blog-posts.json');
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));

  console.log(`Found ${blogPosts.length} blog posts to migrate\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of blogPosts) {
    try {
      // Read markdown content
      const contentPath = path.join(__dirname, '../src/content/blog/posts', post.contentFile);

      if (!fs.existsSync(contentPath)) {
        console.error(`❌ Content file not found: ${post.contentFile}`);
        errorCount++;
        continue;
      }

      const content = fs.readFileSync(contentPath, 'utf-8');
      const readTime = calculateReadTime(content);

      // Prepare blog post data
      const blogPostData = {
        slug: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: content,
        author: post.author || 'Kris Armstrong',
        date: new Date(post.date).toISOString(),
        published: true,
        featured: post.featured || false,
        read_time: readTime,
        tags: post.tags || [],
        meta_title: post.title,
        meta_description: post.excerpt,
      };

      // Insert into Supabase
      const { error } = await supabase.from('blog_posts').insert([blogPostData]).select();

      if (error) {
        console.error(`❌ Error inserting "${post.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated: "${post.title}" (${readTime} min read)`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing "${post.title}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Migration complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(60) + '\n');
}

// Run migration
async function main() {
  console.log('='.repeat(60));
  console.log('BLOG POST MIGRATION TO SUPABASE');
  console.log('='.repeat(60));

  await createTable();

  console.log('\nStarting automatic migration in 2 seconds...\n');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await migrateBlogPosts();
}

main().catch(console.error);
