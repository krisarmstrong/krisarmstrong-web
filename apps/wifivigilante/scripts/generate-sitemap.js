import { writeFileSync, mkdirSync } from 'fs';
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

const today = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
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

console.log(`Sitemap generated with ${routes.length} routes`);
