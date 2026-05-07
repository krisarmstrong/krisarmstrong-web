import dotenv from 'dotenv';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
dotenv.config();

const BASE_URL = 'https://wifi-vigilante.com';

const routes = [
  '/',
  '/about',
  '/cases',
  '/case-of-the-day',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
];

function getCaseRoutes() {
  const dataPath = resolve(process.cwd(), 'src/data/wifiVigilanteData.json');
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));
  console.log(`Discovered ${data.cases.length} bundled cases`);
  return data.cases.map((c) => `/cases/${c.public_id}`);
}

const caseRoutes = getCaseRoutes();

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
