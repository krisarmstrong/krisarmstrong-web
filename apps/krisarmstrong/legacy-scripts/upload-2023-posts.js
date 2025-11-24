import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Supabase credentials from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗ MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗ MISSING');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 2023 blog posts metadata - ACCURATE TIMELINE
const posts2023 = [
  {
    id: 'wifi6e-maturity-enterprise-reality-jan2023',
    title: 'Wi-Fi 6E Maturity: From Early Adoption to Enterprise Reality',
    excerpt:
      'Two years since the FCC opened 6 GHz spectrum, Wi-Fi 6E has evolved from experimental technology to enterprise standard. My 2023 deployments show mature ecosystems, refined best practices, and clear ROI patterns emerging across industries.',
    date: '2023-01-23',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6E', '6 GHz', 'Enterprise', 'Deployment', 'ROI'],
    featured: true,
    contentFile: 'wifi6e-maturity-enterprise-reality-jan2023.md',
  },
  {
    id: 'afc-standard-power-deployment-guide-feb2023',
    title: 'AFC and Standard Power 6 GHz: Complete Deployment Guide',
    excerpt:
      'Automated Frequency Coordination (AFC) systems now enable standard power operations in 6 GHz, dramatically extending outdoor coverage and capacity. My first AFC-enabled deployments reveal both the tremendous potential and practical implementation challenges.',
    date: '2023-02-20',
    author: 'Kris Armstrong',
    tags: ['AFC', '6 GHz', 'Standard Power', 'Wi-Fi 6E', 'Outdoor'],
    featured: false,
    contentFile: 'afc-standard-power-deployment-guide-feb2023.md',
  },
  {
    id: 'zero-trust-wireless-architecture-evolution-mar2023',
    title: 'Zero Trust Wireless Architecture: 2023 Evolution and Best Practices',
    excerpt:
      'Zero Trust has moved from theory to standard practice in enterprise wireless. My 2023 implementations show mature frameworks, refined microsegmentation strategies, and practical integration patterns that balance security with user experience.',
    date: '2023-03-22',
    author: 'Kris Armstrong',
    tags: ['Zero Trust', 'Security', 'Enterprise', 'Architecture', 'Best Practices'],
    featured: false,
    contentFile: 'zero-trust-wireless-architecture-evolution-mar2023.md',
  },
  {
    id: 'ai-driven-network-optimization-reality-apr2023',
    title: 'AI-Driven Network Optimization: 2023 Real-World Performance',
    excerpt:
      'Three years into AI/ML adoption in wireless networking, we can finally measure real impact. My 2023 analysis of production AI systems reveals surprising truths about automated optimization, predictive analytics, and the human-AI collaboration model.',
    date: '2023-04-18',
    author: 'Kris Armstrong',
    tags: ['AI/ML', 'Network Optimization', 'Automation', 'Analytics', 'Performance'],
    featured: false,
    contentFile: 'ai-driven-network-optimization-reality-apr2023.md',
  },
  {
    id: '6ghz-channel-width-optimization-may2023',
    title: '6 GHz Channel Width Optimization: 160 MHz vs 320 MHz in Production',
    excerpt:
      "The 6 GHz band enables unprecedented channel widths, but bigger isn't always better. My 2023 production deployments reveal when to use 160 MHz versus 320 MHz channels—and why 80 MHz still has a place in modern design.",
    date: '2023-05-25',
    author: 'Kris Armstrong',
    tags: ['6 GHz', 'Channel Planning', 'Wi-Fi 6E', 'Performance', 'Optimization'],
    featured: true,
    contentFile: '6ghz-channel-width-optimization-may2023.md',
  },
  {
    id: 'wpa3-enterprise-deployment-maturity-jun2023',
    title: 'WPA3-Enterprise Deployment: Mature Strategies for 2023',
    excerpt:
      'WPA3-Enterprise adoption has reached critical mass with 90% client support in corporate environments. My 2023 deployments show how organizations are leveraging 192-bit security, simplified onboarding, and enhanced identity frameworks.',
    date: '2023-06-21',
    author: 'Kris Armstrong',
    tags: ['WPA3', 'Security', 'Enterprise', '802.1X', 'Authentication'],
    featured: false,
    contentFile: 'wpa3-enterprise-deployment-maturity-jun2023.md',
  },
  {
    id: 'network-automation-infrastructure-code-jul2023',
    title: 'Network Automation and Infrastructure as Code: Enterprise Wireless at Scale',
    excerpt:
      'Infrastructure as Code principles have transformed enterprise wireless management. My 2023 implementations demonstrate how GitOps, declarative configuration, and CI/CD pipelines deliver consistent, auditable network operations at scale.',
    date: '2023-07-19',
    author: 'Kris Armstrong',
    tags: ['Automation', 'Infrastructure as Code', 'GitOps', 'DevOps', 'Enterprise'],
    featured: false,
    contentFile: 'network-automation-infrastructure-code-jul2023.md',
  },
  {
    id: 'multi-vendor-wifi6e-interoperability-aug2023',
    title: 'Multi-Vendor Wi-Fi 6E Interoperability: 2023 Lab and Field Results',
    excerpt:
      "Wi-Fi 6E's maturity enables true multi-vendor deployments without compromise. My 2023 interoperability testing across major vendors reveals excellent compatibility in 6 GHz, with important considerations for roaming and advanced features.",
    date: '2023-08-23',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6E', 'Interoperability', 'Multi-vendor', 'Testing', 'Enterprise'],
    featured: false,
    contentFile: 'multi-vendor-wifi6e-interoperability-aug2023.md',
  },
  {
    id: 'converged-wireless-architecture-sep2023',
    title: 'Converged Wireless Architecture: Wi-Fi, Private 5G, and IoT Integration',
    excerpt:
      'Modern enterprises require unified wireless infrastructure spanning Wi-Fi 6E, private cellular, and IoT networks. My 2023 converged deployments show how to integrate these technologies while maintaining security, performance, and manageability.',
    date: '2023-09-20',
    author: 'Kris Armstrong',
    tags: ['Convergence', 'Private 5G', 'IoT', 'Wi-Fi 6E', 'Architecture'],
    featured: false,
    contentFile: 'converged-wireless-architecture-sep2023.md',
  },
  {
    id: 'wifi7-preview-next-generation-wireless-oct2023',
    title: 'Wi-Fi 7 Preview: Understanding Next-Generation Wireless Technology',
    excerpt:
      "As Wi-Fi 7 (802.11be) moves toward ratification, early chipsets and draft implementations are emerging. While commercial products remain months away, understanding Wi-Fi 7's revolutionary features helps prepare for the next wireless evolution.",
    date: '2023-10-24',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', '802.11be', 'Future Technology', 'Preview', 'Standards'],
    featured: true,
    contentFile: 'wifi7-preview-next-generation-wireless-oct2023.md',
  },
  {
    id: 'advanced-6ghz-troubleshooting-nov2023',
    title: 'Advanced 6 GHz Troubleshooting: Lessons from Three Years of Deployments',
    excerpt:
      'Three years of Wi-Fi 6E deployments have revealed unique 6 GHz troubleshooting patterns. My 2023 diagnostic methodology addresses common issues from client discovery to roaming behavior, providing systematic approaches to 6 GHz optimization.',
    date: '2023-11-21',
    author: 'Kris Armstrong',
    tags: ['6 GHz', 'Troubleshooting', 'Wi-Fi 6E', 'Diagnostics', 'Best Practices'],
    featured: false,
    contentFile: 'advanced-6ghz-troubleshooting-nov2023.md',
  },
  {
    id: '2023-wireless-retrospective-wifi7-horizon-dec2023',
    title: '2023 Wireless Retrospective: Wi-Fi 6E Dominance and Wi-Fi 7 on the Horizon',
    excerpt:
      "2023 marked Wi-Fi 6E's transition to mainstream enterprise standard while Wi-Fi 7 emerged from standards bodies toward commercial reality. As the industry prepares for 802.11be's 2024 arrival, mature 6 GHz deployments provide the foundation for next-generation wireless.",
    date: '2023-12-19',
    author: 'Kris Armstrong',
    tags: ['Retrospective', 'Wi-Fi 6E', 'Wi-Fi 7', 'Industry Trends', '2023 Review'],
    featured: false,
    contentFile: '2023-wireless-retrospective-wifi7-horizon-dec2023.md',
  },
];

// Helper function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function upload2023Posts() {
  console.log('='.repeat(60));
  console.log('UPLOADING 2023 BLOG POSTS TO SUPABASE');
  console.log('='.repeat(60));
  console.log(`\nFound ${posts2023.length} posts to upload\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts2023) {
    try {
      // Read markdown content
      const contentPath = path.join(__dirname, '../src/content/blog/posts', post.contentFile);

      if (!fs.existsSync(contentPath)) {
        console.error(`❌ Content file not found: ${post.contentFile}`);
        errorCount++;
        continue;
      }

      const content = fs.readFileSync(contentPath, 'utf-8');
      const readTime = calculateReadTime(content);

      // Prepare blog post data
      const blogPostData = {
        slug: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: content,
        author: post.author,
        date: new Date(post.date).toISOString(),
        published: true,
        featured: post.featured,
        read_time: readTime,
        tags: post.tags,
        meta_title: post.title,
        meta_description: post.excerpt,
      };

      // Insert into Supabase
      const { error } = await supabase.from('blog_posts').insert([blogPostData]);

      if (error) {
        console.error(`❌ Error inserting "${post.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Uploaded: "${post.title}" (${readTime} min read)`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing "${post.title}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Upload complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(60) + '\n');

  // Get total count
  const { count, error: countError } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  if (!countError) {
    console.log(`📊 Total posts in database: ${count}`);
    console.log(`\n🎯 Target: 71 posts (23 + 12 + 12 + 12 + 12)`);
    console.log(`📈 Current: ${count} posts`);

    if (count === 71) {
      console.log(`\n🎉 SUCCESS! All 71 posts uploaded!`);
    } else if (count > 71) {
      console.log(`\n⚠️  WARNING: More posts than expected (${count} > 71)`);
    } else {
      console.log(`\n⚠️  Missing ${71 - count} posts`);
    }
  }
}

upload2023Posts().catch(console.error);
