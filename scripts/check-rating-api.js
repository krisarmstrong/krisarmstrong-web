import path from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve('apps/wifivigilante/.env');
config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or anon key; check apps/wifivigilante/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runCheck() {
  const itemId = 'cloud-managed-networks-evolution-may2021';
  const itemType = 'blog';

  console.log('get_rating_stats →');
  const stats = await supabase.rpc('get_rating_stats', {
    p_item_id: itemId,
    p_item_type: itemType,
  });
  if (stats.error) {
    console.error(stats.error);
  } else {
    console.log(stats.data);
  }

  console.log('get_user_rating →');
  const rating = await supabase.rpc('get_user_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_user_fingerprint: 'script-rating-check',
  });
  if (rating.error) {
    console.error(rating.error);
  } else {
    console.log(rating.data);
  }

  console.log('submit_rating →');
  const submit = await supabase.rpc('submit_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_rating: 5,
    p_user_fingerprint: 'script-rating-check',
  });
  if (submit.error) {
    console.error(submit.error);
  } else {
    console.log(submit.data);
  }
}

runCheck().catch((err) => {
  console.error('Script failed', err);
  process.exit(1);
});
