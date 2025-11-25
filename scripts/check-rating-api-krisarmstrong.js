import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load krisarmstrong's .env file manually
const envPath = path.resolve(__dirname, '../apps/krisarmstrong/.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse env variables
const envVars = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or anon key; check apps/krisarmstrong/.env');
  process.exit(1);
}

console.log('Testing krisarmstrong Supabase project:', supabaseUrl.split('/')[2]);

const supabase = createClient(supabaseUrl, supabaseKey);

async function runCheck() {
  const itemId = 'test-blog-post';
  const itemType = 'blog';
  const fingerprint = 'script-rating-check-krisarmstrong';

  console.log('\n1. Testing get_rating_stats RPC...');
  const stats = await supabase.rpc('get_rating_stats', {
    p_item_id: itemId,
    p_item_type: itemType,
  });
  console.log('Stats:', stats.data, 'Error:', stats.error?.message || 'none');

  console.log('\n2. Testing get_user_rating RPC...');
  const userRating = await supabase.rpc('get_user_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_user_fingerprint: fingerprint,
  });
  console.log('User rating:', userRating.data, 'Error:', userRating.error?.message || 'none');

  console.log('\n3. Testing submit_rating RPC...');
  const submit = await supabase.rpc('submit_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_rating: 5,
    p_user_fingerprint: fingerprint,
  });
  console.log('Submit:', submit.data, 'Error:', submit.error?.message || 'none');

  console.log('\n4. Testing ratings table access...');
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('user_fingerprint', fingerprint)
    .order('created_at', { ascending: false });
  console.log('Stored rows:', data?.slice(0, 5), 'Error:', error?.message || 'none');

  // Summary
  console.log('\n=== SUMMARY ===');
  if (stats.error || userRating.error || submit.error || error) {
    console.log('❌ Some RPC functions or table access failed.');
    console.log('   You need to run the ratings migration on this Supabase project.');
    console.log('   See: supabase-ratings-migration.sql');
  } else {
    console.log('✅ All rating functions working correctly!');
  }
}

runCheck().catch((err) => {
  console.error('Script failed', err);
  process.exit(1);
});
