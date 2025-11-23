/**
 * Seed script to populate test ratings for blog posts and case studies
 *
 * Usage:
 * 1. First run the SQL migration in both Supabase projects
 * 2. Set environment variables for the site you want to seed
 * 3. Run: npx tsx seed-ratings.ts <site>
 *
 * Examples:
 *   npx tsx seed-ratings.ts krisarmstrong
 *   npx tsx seed-ratings.ts wifivigilante
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const MIN_RATINGS_PER_ITEM = 10; // Minimum number of ratings per item
const MAX_RATINGS_PER_ITEM = 25; // Maximum number of ratings per item
const MIN_RATING = 4; // Minimum rating value (4.0 stars)
const MAX_RATING = 5; // Maximum rating value (5.0 stars)

interface _BlogPost {
  slug: string;
  title: string;
}

interface _CaseStudy {
  public_id: string;
  title: string;
}

// Generate a random rating between MIN and MAX
function randomRating(): number {
  return Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING;
}

// Generate random number of ratings for an item (10-25)
function randomRatingsCount(): number {
  return Math.floor(Math.random() * (MAX_RATINGS_PER_ITEM - MIN_RATINGS_PER_ITEM + 1)) + MIN_RATINGS_PER_ITEM;
}

// Generate a unique fingerprint for each test user
function generateTestFingerprint(index: number): string {
  return `test-user-${index}-${Math.random().toString(36).substring(7)}`;
}

async function seedKrisarmstrong() {
  console.log('🌱 Seeding ratings for krisarmstrong blog posts...\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
    console.error('Set them in your shell:');
    console.error('  export VITE_SUPABASE_URL="<url>"');
    console.error('  export VITE_SUPABASE_ANON_KEY="<key>"');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all blog posts
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('slug, title')
    .eq('published', true);

  if (fetchError) {
    console.error('❌ Error fetching blog posts:', fetchError);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('⚠️  No published blog posts found');
    return;
  }

  console.log(`📝 Found ${posts.length} blog posts\n`);

  let totalRatings = 0;

  // Seed ratings for each post
  for (const post of posts) {
    const ratingsCount = randomRatingsCount(); // Random count between 10-25
    console.log(`📊 Seeding ${ratingsCount} ratings for: "${post.title}"`);

    for (let i = 0; i < ratingsCount; i++) {
      const rating = randomRating();
      const fingerprint = generateTestFingerprint(totalRatings + i);

      const { error } = await supabase.rpc('submit_rating', {
        p_item_id: post.slug,
        p_item_type: 'blog',
        p_rating: rating,
        p_user_fingerprint: fingerprint,
      });

      if (error) {
        console.error(`   ❌ Error submitting rating: ${error.message}`);
      } else {
        process.stdout.write(`   ⭐ `);
      }
    }

    // Get and display aggregate stats
    const { data: stats } = await supabase.rpc('get_rating_stats', {
      p_item_id: post.slug,
      p_item_type: 'blog',
    });

    if (stats && stats.length > 0) {
      const avg = parseFloat(stats[0].average_rating);
      const count = parseInt(stats[0].total_ratings, 10);
      console.log(`\n   ✅ Average: ${avg.toFixed(1)} stars from ${count} ratings\n`);
    }

    totalRatings += ratingsCount;
  }

  console.log(`\n✅ Successfully seeded ${totalRatings} ratings for ${posts.length} blog posts!`);
}

async function seedWiFiVigilante() {
  console.log('🌱 Seeding ratings for Wi-Fi Vigilante case studies...\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
    console.error('Set them in your shell:');
    console.error('  export VITE_SUPABASE_URL="<url>"');
    console.error('  export VITE_SUPABASE_ANON_KEY="<key>"');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all case studies
  const { data: cases, error: fetchError } = await supabase
    .from('case_files')
    .select('public_id, title');

  if (fetchError) {
    console.error('❌ Error fetching case studies:', fetchError);
    process.exit(1);
  }

  if (!cases || cases.length === 0) {
    console.log('⚠️  No published case studies found');
    return;
  }

  console.log(`📝 Found ${cases.length} case studies\n`);

  let totalRatings = 0;

  // Seed ratings for each case
  for (const caseStudy of cases) {
    const ratingsCount = randomRatingsCount(); // Random count between 10-25
    console.log(`📊 Seeding ${ratingsCount} ratings for: "${caseStudy.title}"`);

    for (let i = 0; i < ratingsCount; i++) {
      const rating = randomRating();
      const fingerprint = generateTestFingerprint(totalRatings + i);

      const { error } = await supabase.rpc('submit_rating', {
        p_item_id: caseStudy.public_id,
        p_item_type: 'case',
        p_rating: rating,
        p_user_fingerprint: fingerprint,
      });

      if (error) {
        console.error(`   ❌ Error submitting rating: ${error.message}`);
      } else {
        process.stdout.write(`   ⭐ `);
      }
    }

    // Get and display aggregate stats
    const { data: stats } = await supabase.rpc('get_rating_stats', {
      p_item_id: caseStudy.public_id,
      p_item_type: 'case',
    });

    if (stats && stats.length > 0) {
      const avg = parseFloat(stats[0].average_rating);
      const count = parseInt(stats[0].total_ratings, 10);
      console.log(`\n   ✅ Average: ${avg.toFixed(1)} stars from ${count} ratings\n`);
    }

    totalRatings += ratingsCount;
  }

  console.log(`\n✅ Successfully seeded ${totalRatings} ratings for ${cases.length} case studies!`);
}

// Main execution
async function main() {
  const site = process.argv[2];

  if (!site) {
    console.error('❌ Error: Please specify a site to seed');
    console.error('\nUsage:');
    console.error('  npx tsx seed-ratings.ts krisarmstrong');
    console.error('  npx tsx seed-ratings.ts wifivigilante');
    process.exit(1);
  }

  console.log('🚀 Ratings Seed Script\n');
  console.log(`📍 Site: ${site}`);
  console.log(`📊 Ratings per item: ${MIN_RATINGS_PER_ITEM}-${MAX_RATINGS_PER_ITEM} (random)`);
  console.log(`⭐ Rating range: ${MIN_RATING}-${MAX_RATING} stars\n`);

  try {
    if (site === 'krisarmstrong') {
      await seedKrisarmstrong();
    } else if (site === 'wifivigilante') {
      await seedWiFiVigilante();
    } else {
      console.error(`❌ Unknown site: ${site}`);
      console.error('Valid options: krisarmstrong, wifivigilante');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
