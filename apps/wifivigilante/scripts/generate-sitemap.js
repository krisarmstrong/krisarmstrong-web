import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = 'https://wifi-vigilante.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const routes = [
  '/',
  '/about',
  '/cases',
  '/case-of-the-day',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
];

// Fetch cases from Supabase
async function fetchCases() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not found, skipping case routes');
    return [];
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/case_files?select=public_id&order=id`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const cases = await response.json();
    console.log(`Discovered ${cases.length} cases from Supabase`);
    return cases.map((c) => `/cases/${c.public_id}`);
  } catch (error) {
    console.warn('Unable to fetch cases from Supabase:', error.message);
    return [];
  }
}

const caseRoutes = await fetchCases();

const today = new Date().toISOString().split('T')[0];

const allRoutes = [...routes, ...caseRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outDir = resolve(process.cwd(), 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'sitemap.xml'), xml, 'utf8');

console.log(`Sitemap generated with ${allRoutes.length} routes`);
