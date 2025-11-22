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

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Get 5 random cases with their sector and subsector info
  const { data: cases, error } = await supabase
    .from('case_files')
    .select(`
      *,
      sectors (name),
      subsectors (name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n📋 Sample Cases Review\n');
  console.log('='.repeat(80));

  cases.forEach((c, idx) => {
    console.log(`\n[Case ${idx + 1}]`);
    console.log(`Title: ${c.title}`);
    console.log(`Sector: ${c.sectors?.name || 'N/A'}`);
    console.log(`Subsector: ${c.subsectors?.name || 'N/A'}`);
    console.log(`Tool: ${c.tool}`);
    console.log(`Category: ${c.category}`);
    console.log(`\nIncident Overview:`);
    console.log(c.incident_overview);
    console.log(`\nInvestigation Breakdown:`);
    console.log(c.investigation_breakdown?.substring(0, 200) + '...');
    console.log(`\nVerdict: ${c.verdict}`);
    console.log('\n' + '-'.repeat(80));
  });

  // Check if any cases are missing subsectors
  const { data: missingSubsectors } = await supabase
    .from('case_files')
    .select('id, title')
    .is('subsector_id', null);

  if (missingSubsectors && missingSubsectors.length > 0) {
    console.log(`\n⚠️  Warning: ${missingSubsectors.length} cases are missing subsectors`);
  } else {
    console.log(`\n✅ All cases have subsectors assigned`);
  }
}

main().catch(console.error);
