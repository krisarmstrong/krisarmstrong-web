import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogPostsPath = path.join(__dirname, '../src/content/blog/blog-posts.json');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

// Read blog posts
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));

// Static pages with priorities and change frequencies
const staticPages = [
  { loc: '/', lastmod: '2025-11-13', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', lastmod: '2025-11-13', changefreq: 'monthly', priority: '0.8' },
  { loc: '/resume', lastmod: '2025-11-13', changefreq: 'monthly', priority: '0.9' },
  { loc: '/skills', lastmod: '2025-11-13', changefreq: 'monthly', priority: '0.8' },
  { loc: '/projects', lastmod: '2025-11-13', changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog', lastmod: '2025-11-13', changefreq: 'weekly', priority: '0.9' },
  { loc: '/contact', lastmod: '2025-11-13', changefreq: 'monthly', priority: '0.7' },
  { loc: '/privacy-policy', lastmod: '2025-11-13', changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms-of-service', lastmod: '2025-11-13', changefreq: 'yearly', priority: '0.3' },
];

// Generate sitemap XML
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Add static pages
staticPages.forEach(page => {
  sitemap += '  <url>\n';
  sitemap += `    <loc>https://krisarmstrong.com${page.loc}</loc>\n`;
  sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
  sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
  sitemap += `    <priority>${page.priority}</priority>\n`;
  sitemap += '  </url>\n';
});

// Add blog posts
blogPosts.forEach(post => {
  const priority = post.featured ? '0.8' : '0.7';
  sitemap += '  <url>\n';
  sitemap += `    <loc>https://krisarmstrong.com/blog/${post.id}</loc>\n`;
  sitemap += `    <lastmod>${post.date}</lastmod>\n`;
  sitemap += `    <changefreq>monthly</changefreq>\n`;
  sitemap += `    <priority>${priority}</priority>\n`;
  sitemap += '  </url>\n';
});

sitemap += '</urlset>\n';

// Write sitemap
fs.writeFileSync(sitemapPath, sitemap);

console.log(`✅ Generated sitemap with ${staticPages.length + blogPosts.length} URLs`);
console.log(`📝 Output: ${sitemapPath}`);
console.log(`📊 Breakdown: ${staticPages.length} static pages + ${blogPosts.length} blog posts`);
