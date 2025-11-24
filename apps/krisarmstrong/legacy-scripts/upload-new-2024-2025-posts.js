import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { newPosts2024 } from './NEW-POSTS-2024-2025-METADATA.js';
import { newPosts2025 } from './NEW-POSTS-2024-2025-METADATA.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Supabase credentials from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗ MISSING');
  console.error('\nPlease ensure your .env file contains:');
  console.error('VITE_SUPABASE_URL=your-supabase-url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function uploadNewPosts() {
  console.log('='.repeat(80));
  console.log('UPLOADING NEW 2024-2025 BLOG POSTS TO SUPABASE');
  console.log('='.repeat(80));

  const allNewPosts = [...newPosts2024, ...newPosts2025];
  console.log(`\nPreparing to upload ${allNewPosts.length} new posts:`);
  console.log(`  • 2024 posts: ${newPosts2024.length}`);
  console.log(`  • 2025 posts: ${newPosts2025.length}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const post of allNewPosts) {
    try {
      // Read markdown content
      const contentPath = path.join(
        __dirname,
        '../src/content/blog/posts/2024-2025-new',
        post.contentFile
      );

      if (!fs.existsSync(contentPath)) {
        console.error(`❌ Content file not found: ${post.contentFile}`);
        errorCount++;
        continue;
      }

      const content = fs.readFileSync(contentPath, 'utf-8');
      const readTime = calculateReadTime(content);

      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', post.id)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped (already exists): "${post.title}"`);
        skippedCount++;
        continue;
      }

      // Prepare blog post data
      const postData = {
        slug: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: content,
        author: post.author,
        date: new Date(post.date).toISOString(),
        published: true,
        featured: post.featured,
        read_time: readTime,
        tags: post.tags,
        meta_title: post.title,
        meta_description: post.excerpt,
      };

      // Insert into Supabase
      const { error } = await supabase.from('blog_posts').insert([postData]);

      if (error) {
        console.error(`❌ Error inserting "${post.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Uploaded: "${post.title}" (${readTime} min read, ${post.date})`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing "${post.title}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`UPLOAD SUMMARY`);
  console.log('='.repeat(80));
  console.log(`✅ Successfully uploaded: ${successCount}`);
  console.log(`⏭️  Skipped (existing): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(80));

  // Get total count in database
  const { count, error: countError } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  if (!countError) {
    console.log('');
    console.log('='.repeat(80));
    console.log(`DATABASE STATUS`);
    console.log('='.repeat(80));
    console.log(`📊 Total posts in database: ${count}`);
    console.log(`🎯 Expected total: 94 posts (71 existing + 23 new)`);

    if (count === 94) {
      console.log(`\n🎉 SUCCESS! All 94 posts are in the database!`);
    } else if (count > 94) {
      console.log(`\n⚠️  WARNING: More posts than expected (${count} > 94)`);
    } else {
      console.log(`\n⚠️  Missing ${94 - count} posts to reach target`);
    }
    console.log('='.repeat(80));
  }
}

uploadNewPosts().catch(console.error);
