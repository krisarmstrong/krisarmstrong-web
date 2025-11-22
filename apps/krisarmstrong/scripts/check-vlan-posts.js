import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Supabase credentials from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗ MISSING');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await supabase
  .from('blog_posts')
  .select('title, date, read_time')
  .ilike('title', '%vlan%')
  .order('date', { ascending: true });

if (error) {
  console.error('Error:', error);
} else {
  console.log('\n=== VLAN POSTS IN DATABASE ===\n');
  data.forEach((post, idx) => {
    console.log(`${idx + 1}. ${post.title}`);
    console.log(`   Date: ${post.date.split('T')[0]}, Read time: ${post.read_time} min\n`);
  });
  console.log(`Total VLAN posts: ${data.length}`);
}
