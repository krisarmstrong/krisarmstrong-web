import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, '../src/content/blog/posts');
const outputFile = path.join(__dirname, '../src/content/blog/blog-posts.json');

// Auto-generate metadata from filenames and content
const posts = [];

// Read all markdown files (exclude README)
const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

files.forEach((filename) => {
  const filepath = path.join(postsDir, filename);
  const content = fs.readFileSync(filepath, 'utf-8');

  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : filename.replace('.md', '');

  // Extract first paragraph as excerpt
  const lines = content.split('\n').filter((l) => l.trim());
  let excerpt = '';
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('#') && lines[i].length > 50) {
      excerpt = lines[i].substring(0, 150) + '...';
      break;
    }
  }

  // Parse filename for metadata
  // Format: wifi6-ofdma-mumimo-jan2024.md
  const parts = filename.replace('.md', '').split('-');
  const monthYear = parts[parts.length - 1]; // "jan2024" or "feb2025"

  // Extract month and year
  const monthMap = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  };

  const month = monthYear.substring(0, 3);
  const year = monthYear.substring(3);
  const monthNum = monthMap[month] || '01';
  const date = `${year}-${monthNum}-15`;

  // Determine tags based on filename
  const tags = [];
  if (filename.includes('wifi6e')) {
    tags.push('Wi-Fi 6E', 'Enterprise', '6 GHz');
  } else if (filename.includes('wifi7')) {
    tags.push('Wi-Fi 7', '802.11be', 'Next Generation');
  } else if (filename.includes('wifi6')) {
    tags.push('Wi-Fi 6', '802.11ax', 'Enterprise');
  }

  // Add specific tech tags
  if (filename.includes('ofdma') || filename.includes('mumimo')) {
    tags.push('OFDMA', 'MU-MIMO', 'Technical Deep Dive');
  }
  if (filename.includes('security') || filename.includes('wpa3')) {
    tags.push('Security', 'WPA3');
  }
  if (filename.includes('troubleshooting')) {
    tags.push('Troubleshooting', 'Best Practices');
  }
  if (filename.includes('design') || filename.includes('deployment')) {
    tags.push('Network Design', 'Deployment');
  }
  if (filename.includes('mlo')) {
    tags.push('MLO', 'Multi-Link Operation');
  }
  if (filename.includes('qam')) {
    tags.push('Modulation', 'Performance');
  }

  // Ensure we have at least 3 tags
  if (tags.length < 3) {
    tags.push('Wireless', 'Enterprise Networking');
  }

  // Generate ID from filename
  const id = filename
    .replace('.md', '')
    .replace(
      /-jan\d{4}|-feb\d{4}|-mar\d{4}|-apr\d{4}|-may\d{4}|-jun\d{4}|-jul\d{4}|-aug\d{4}|-sep\d{4}|-oct\d{4}|-nov\d{4}|-dec\d{4}/,
      ''
    );

  // Featured posts: Jan 2024 and Jan 2025
  const featured = filename.includes('jan2024') || filename.includes('jan2025');

  posts.push({
    id,
    title,
    excerpt,
    date,
    author: 'Kris Armstrong',
    tags: tags.slice(0, 5), // Max 5 tags
    featured,
    contentFile: filename,
  });
});

// Sort by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write to file
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));

console.log(`✅ Generated metadata for ${posts.length} blog posts`);
console.log(`📝 Output: ${outputFile}`);
