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
  const fingerprint = 'script-rating-check';

  const stats = await supabase.rpc('get_rating_stats', {
    p_item_id: itemId,
    p_item_type: itemType,
  });
  console.log('Stats', stats.data, stats.error);

  const userRating = await supabase.rpc('get_user_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_user_fingerprint: fingerprint,
  });
  console.log('User rating', userRating.data, userRating.error);

  const submit = await supabase.rpc('submit_rating', {
    p_item_id: itemId,
    p_item_type: itemType,
    p_rating: 4,
    p_user_fingerprint: fingerprint,
  });
  console.log('Submit', submit.data, submit.error);

  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('user_fingerprint', fingerprint)
    .order('created_at', { ascending: false });
  console.log('Stored rows', data?.slice(0, 5), error);
}

runCheck().catch((err) => {
  console.error('Script failed', err);
  process.exit(1);
});
