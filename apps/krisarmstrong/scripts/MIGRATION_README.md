# Blog Post Migration to Supabase

This directory contains scripts to migrate blog posts from JSON files to Supabase.

## Prerequisites

1. Supabase project created: `cuuxpdhtdrwwbplkvsqe`
2. Supabase client installed: `@supabase/supabase-js`

## Migration Steps

### Step 1: Create Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/cuuxpdhtdrwwbplkvsqe
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to execute the SQL

This will create:
- `blog_posts` table with all necessary columns
- Performance indexes for fast queries
- Full-text search index
- Row Level Security (RLS) policies

### Step 2: Run Migration Script

After the table is created, run the migration script:

```bash
cd /Users/krisarmstrong/Developer/projects/krisarmstrong-portfolio
node scripts/migrate-blog-to-supabase.js
```

The script will:
- Read all 23 blog posts from `src/content/blog/blog-posts.json`
- Read the markdown content from `src/content/blog/posts/`
- Calculate read time for each post
- Upload all posts to Supabase
- Display success/error count

### Step 3: Verify Migration

Check your Supabase dashboard to verify all 23 posts were uploaded:

1. Go to **Table Editor** in the left sidebar
2. Select `blog_posts` table
3. Verify all posts are present

## What Gets Migrated

Each blog post includes:
- `slug` - URL-friendly identifier (from `id` in JSON)
- `title` - Post title
- `excerpt` - Short description
- `content` - Full markdown content
- `author` - Author name (default: "Kris Armstrong")
- `date` - Publication date
- `published` - Always set to `true`
- `featured` - Featured flag from JSON
- `read_time` - Auto-calculated based on word count
- `tags` - Array of tags
- `meta_title` - Same as title (for SEO)
- `meta_description` - Same as excerpt (for SEO)

## Files

- `supabase-schema.sql` - Database schema and indexes
- `migrate-blog-to-supabase.js` - Migration script
- `MIGRATION_README.md` - This file
