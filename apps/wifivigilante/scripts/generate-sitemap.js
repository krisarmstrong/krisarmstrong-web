import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

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

const caseSqlPath = resolve(process.cwd(), 'database/import_cases.sql');
let caseRoutes = [];
try {
  const sql = readFileSync(caseSqlPath, 'utf8');
  const matches = sql.matchAll(/VALUES\s*\(([\s\S]*?)\)\s*;/gi);
  const caseIds = new Set();

  for (const match of matches) {
    const block = match[1];
    const idMatch = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.exec(block);
    if (idMatch) {
      caseIds.add(idMatch[0]);
    }
  }

  caseRoutes = Array.from(caseIds).map((id) => `/cases/${id}`);
  console.log(`Discovered ${caseRoutes.length} cases from SQL`);
} catch (error) {
  console.warn('Unable to read case SQL for sitemap generation:', error);
}

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
