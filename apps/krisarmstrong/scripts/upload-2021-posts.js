import { createClient } from '@supabase/supabase-js';
/* eslint-disable security/detect-non-literal-fs-filename */
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

// 2021 blog posts metadata
const posts2021 = [
  {
    id: "wifi6-deployment-best-practices-jan2021",
    title: "Wi-Fi 6 Deployment Best Practices for Enterprise Networks",
    excerpt: "After spending 2020 deploying Wi-Fi 6 (802.11ax) networks across various enterprise environments, I've developed a comprehensive understanding of what works—and what doesn't—in real-world 802.11ax implementations.",
    date: "2021-01-18",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6", "802.11ax", "Enterprise", "Deployment", "Best Practices"],
    featured: false,
    contentFile: "wifi6-deployment-best-practices-jan2021.md"
  },
  {
    id: "wifi6e-planning-readiness-feb2021",
    title: "Wi-Fi 6E Planning and Readiness: Preparing for 6 GHz",
    excerpt: "The FCC's April 2020 decision to open 1200 MHz of spectrum in the 6 GHz band for unlicensed use represents the most significant expansion of Wi-Fi spectrum in history. Wi-Fi 6E promises to fundamentally change wireless network design and performance.",
    date: "2021-02-22",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6E", "6 GHz", "Enterprise", "Planning"],
    featured: false,
    contentFile: "wifi6e-planning-readiness-feb2021.md"
  },
  {
    id: "wpa3-migration-strategy-mar2021",
    title: "WPA3 Migration Strategy: Enterprise Wireless Security Evolution",
    excerpt: "WPA3, the latest Wi-Fi security protocol ratified by Wi-Fi Alliance in 2018, addresses fundamental vulnerabilities in WPA2 that have existed for over a decade. After spending 2020 evaluating WPA3 implementations, I've developed practical migration strategies.",
    date: "2021-03-16",
    author: "Kris Armstrong",
    tags: ["Security", "WPA3", "Enterprise", "Migration"],
    featured: false,
    contentFile: "wpa3-migration-strategy-mar2021.md"
  },
  {
    id: "hybrid-work-network-security-apr2021",
    title: "Hybrid Work Network Security: Securing the Distributed Enterprise",
    excerpt: "The COVID-19 pandemic accelerated a workplace transformation that was already underway: the shift to hybrid work models. As we move through 2021, it's increasingly clear that hybrid work isn't temporary—it's the new permanent reality.",
    date: "2021-04-19",
    author: "Kris Armstrong",
    tags: ["Security", "Zero Trust", "Hybrid Work", "Enterprise"],
    featured: false,
    contentFile: "hybrid-work-network-security-apr2021.md"
  },
  {
    id: "cloud-managed-networks-evolution-may2021",
    title: "Cloud-Managed Networks: The Evolution of Enterprise Wireless Management",
    excerpt: "The enterprise wireless network management landscape is undergoing a fundamental transformation. Traditional on-premises controller architectures are rapidly giving way to cloud-managed platforms.",
    date: "2021-05-24",
    author: "Kris Armstrong",
    tags: ["Cloud Management", "Enterprise", "Network Design"],
    featured: false,
    contentFile: "cloud-managed-networks-evolution-may2021.md"
  },
  {
    id: "wifi6-performance-optimization-jun2021",
    title: "Wi-Fi 6 Performance Optimization: Real-World Tuning Strategies",
    excerpt: "Six months into 2021, Wi-Fi 6 deployments have matured significantly. However, realizing Wi-Fi 6's full performance potential requires more than simply installing 802.11ax access points—it demands careful optimization.",
    date: "2021-06-21",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6", "802.11ax", "Performance", "Optimization", "Best Practices"],
    featured: false,
    contentFile: "wifi6-performance-optimization-jun2021.md"
  },
  {
    id: "zero-trust-network-access-intro-jul2021",
    title: "Zero Trust Network Access: Introduction and Implementation",
    excerpt: "Zero Trust has evolved from an abstract security concept to a practical framework reshaping enterprise network architecture. The hybrid work explosion of 2020-2021 has made zero trust migration from optional modernization to essential security requirement.",
    date: "2021-07-26",
    author: "Kris Armstrong",
    tags: ["Zero Trust", "Security", "Enterprise", "Network Design"],
    featured: false,
    contentFile: "zero-trust-network-access-intro-jul2021.md"
  },
  {
    id: "enterprise-iot-security-wifi6-aug2021",
    title: "Enterprise IoT Security with Wi-Fi 6: Strategies and Best Practices",
    excerpt: "Enterprise environments now support hundreds or thousands of IoT devices creating unprecedented capabilities—and massive security challenges. Wi-Fi 6 introduces capabilities specifically designed to support large IoT deployments.",
    date: "2021-08-23",
    author: "Kris Armstrong",
    tags: ["IoT", "Security", "Wi-Fi 6", "Enterprise"],
    featured: false,
    contentFile: "enterprise-iot-security-wifi6-aug2021.md"
  },
  {
    id: "network-visibility-analytics-sep2021",
    title: "Network Visibility and Analytics: Modern Wireless Network Intelligence",
    excerpt: "The evolution from traditional controller-based wireless management to cloud-managed platforms has fundamentally transformed network visibility and analytics capabilities, enabling proactive issue identification before users experience problems.",
    date: "2021-09-20",
    author: "Kris Armstrong",
    tags: ["Analytics", "Cloud Management", "Enterprise", "Monitoring"],
    featured: false,
    contentFile: "network-visibility-analytics-sep2021.md"
  },
  {
    id: "wifi6-client-device-ecosystem-oct2021",
    title: "Wi-Fi 6 Client Device Ecosystem: 2021 State of Adoption",
    excerpt: "After tracking Wi-Fi 6 client adoption throughout 2021, I've observed client ecosystems reaching the inflection point where Wi-Fi 6 density justifies infrastructure investment for efficiency gains rather than just future-proofing.",
    date: "2021-10-25",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6", "Client Devices", "Enterprise"],
    featured: false,
    contentFile: "wifi6-client-device-ecosystem-oct2021.md"
  },
  {
    id: "multi-gigabit-network-infrastructure-nov2021",
    title: "Multi-Gigabit Network Infrastructure: Preparing for Wi-Fi 6 and Beyond",
    excerpt: "Wi-Fi 6's efficiency improvements enable aggregate access point throughput that easily exceeds traditional gigabit Ethernet uplinks, creating a fundamental infrastructure challenge: wireless technology has outpaced the wired network supporting it.",
    date: "2021-11-22",
    author: "Kris Armstrong",
    tags: ["Infrastructure", "Multi-Gigabit", "Wi-Fi 6", "Enterprise"],
    featured: false,
    contentFile: "multi-gigabit-network-infrastructure-nov2021.md"
  },
  {
    id: "2021-wireless-networking-retrospective-dec2021",
    title: "2021 Wireless Networking Retrospective: A Year of Maturation",
    excerpt: "As 2021 draws to a close, it's time to reflect on a year characterized by maturation, optimization, and strategic planning. While 2020 was defined by pandemic urgency, 2021 was about thoughtful evolution of enterprise wireless infrastructure.",
    date: "2021-12-20",
    author: "Kris Armstrong",
    tags: ["Retrospective", "Wi-Fi 6", "Enterprise", "Industry Trends"],
    featured: false,
    contentFile: "2021-wireless-networking-retrospective-dec2021.md"
  }
];

// Helper function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function upload2021Posts() {
  console.log('='.repeat(60));
  console.log('UPLOADING 2021 BLOG POSTS TO SUPABASE');
  console.log('='.repeat(60));
  console.log(`\nFound ${posts2021.length} posts to upload\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts2021) {
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
      const postData = {
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
const { error } = await supabase.from('blog_posts').insert([postData]);

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
  }
}

upload2021Posts().catch(console.error);
