import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function uploadVLANPosts() {
  console.log('='.repeat(80));
  console.log('UPLOADING VLAN FRIDAY BLOG POSTS TO SUPABASE');
  console.log('='.repeat(80));

  // Read VLAN posts from JSON file
  const vlanPostsPath = path.join(__dirname, '../vlan-fridays-posts.json');
  const vlanPosts = JSON.parse(fs.readFileSync(vlanPostsPath, 'utf-8'));

  console.log(`\nPreparing to upload ${vlanPosts.length} VLAN Friday posts\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const post of vlanPosts) {
    try {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', post.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped (already exists): "${post.title}"`);
        skippedCount++;
        continue;
      }

      // Prepare blog post data
      const postData = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: new Date(post.date).toISOString(),
        published: post.published,
        featured: post.featured,
        read_time: post.read_time,
        tags: post.tags,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        og_image: post.og_image,
      };

      // Insert into Supabase
      const { error } = await supabase.from('blog_posts').insert([postData]);

      if (error) {
        console.error(`❌ Error inserting "${post.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Uploaded: "${post.title}" (${post.read_time} min read, ${post.date})`);
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
    console.log('='.repeat(80));
  }
}

uploadVLANPosts().catch(console.error);
