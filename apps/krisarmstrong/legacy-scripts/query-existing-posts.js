import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
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

async function queryExistingPosts() {
  console.log('='.repeat(80));
  console.log('QUERYING EXISTING BLOG POSTS FROM SUPABASE');
  console.log('='.repeat(80));

  const { data: allPosts, error: allError } = await supabase
    .from('blog_posts')
    .select('slug, title, date, tags, excerpt')
    .order('date', { ascending: true });

  if (allError) {
    console.error('Error fetching posts:', allError);
    return;
  }

  console.log(`\nTotal posts in database: ${allPosts.length}\n`);

  const posts2024 = allPosts.filter((p) => p.date.startsWith('2024'));
  console.log('='.repeat(80));
  console.log(`2024 POSTS (${posts2024.length} posts)`);
  console.log('='.repeat(80));
  posts2024.forEach((post) => {
    const date = new Date(post.date);
    const formattedDate = date.toISOString().split('T')[0];
    console.log(`\n📅 ${formattedDate}`);
    console.log(`   Title: ${post.title}`);
    console.log(`   Tags: ${post.tags.join(', ')}`);
    console.log(`   Excerpt: ${post.excerpt.substring(0, 100)}...`);
  });

  const posts2025 = allPosts.filter((p) => p.date.startsWith('2025'));
  console.log('\n\n' + '='.repeat(80));
  console.log(`2025 POSTS (${posts2025.length} posts)`);
  console.log('='.repeat(80));
  posts2025.forEach((post) => {
    const date = new Date(post.date);
    const formattedDate = date.toISOString().split('T')[0];
    console.log(`\n📅 ${formattedDate}`);
    console.log(`   Title: ${post.title}`);
    console.log(`   Tags: ${post.tags.join(', ')}`);
    console.log(`   Excerpt: ${post.excerpt.substring(0, 100)}...`);
  });

  console.log('\n\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total posts: ${allPosts.length}`);
  console.log(`2024 posts: ${posts2024.length}`);
  console.log(`2025 posts: ${posts2025.length}`);
  console.log(`Other years: ${allPosts.length - posts2024.length - posts2025.length}`);

  console.log('\n2024 Post Dates:');
  posts2024.forEach((p) => {
    const date = new Date(p.date);
    console.log(`  - ${date.toISOString().split('T')[0]}`);
  });

  console.log('\n2025 Post Dates:');
  posts2025.forEach((p) => {
    const date = new Date(p.date);
    console.log(`  - ${date.toISOString().split('T')[0]}`);
  });

  console.log('\n' + '='.repeat(80) + '\n');
}

queryExistingPosts().catch((err) => {
  console.error('Unexpected error querying posts:', err);
  process.exit(1);
});
