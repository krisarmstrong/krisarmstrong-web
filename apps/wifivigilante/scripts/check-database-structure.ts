import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Get all sectors
  const { data: sectors, error: sectorError } = await supabase
    .from('sectors')
    .select('*')
    .order('id');

  if (sectorError) {
    console.error('Error fetching sectors:', sectorError);
    process.exit(1);
  }

  console.log('\n📊 Database Structure\n');
  console.log('='.repeat(60));

  for (const sector of sectors) {
    console.log(`\n${sector.name} (ID: ${sector.id})`);

    // Get subsectors for this sector
    const { data: subsectors, error: subsectorError } = await supabase
      .from('subsectors')
      .select('*')
      .eq('sector_id', sector.id)
      .order('name');

    if (subsectorError) {
      console.error(`  Error fetching subsectors: ${subsectorError}`);
      continue;
    }

    if (subsectors && subsectors.length > 0) {
      subsectors.forEach(sub => {
        console.log(`  - ${sub.name} (ID: ${sub.id})`);
      });
    } else {
      console.log(`  - No subsectors found`);
    }
  }

  console.log('\n' + '='.repeat(60));

  // Check case count
  const { count, error: countError } = await supabase
    .from('case_files')
    .select('*', { count: 'exact', head: true });

  if (!countError) {
    console.log(`\n📈 Total cases in database: ${count}\n`);
  }
}

main().catch(console.error);
