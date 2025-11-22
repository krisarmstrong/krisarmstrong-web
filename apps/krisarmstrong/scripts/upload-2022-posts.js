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

// 2022 blog posts metadata
const posts2022 = [
  {
    id: "wifi6e-deployment-experiences-jan2022",
    title: "Wi-Fi 6E First Deployment Experiences: Real-World 6 GHz Performance",
    excerpt: "After a year of preparation, Wi-Fi 6E devices finally reached critical mass in late 2021, enabling real production deployments. My first large-scale 6 GHz implementation reveals both tremendous promise and important deployment considerations.",
    date: "2022-01-24",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6E", "6 GHz", "Enterprise", "Deployment", "Performance"],
    featured: false,
    contentFile: "wifi6e-deployment-experiences-jan2022.md"
  },
  {
    id: "wpa3-transition-mode-best-practices-feb2022",
    title: "WPA3 Transition Mode: Best Practices for Enterprise Networks",
    excerpt: "As WPA3 becomes standard in enterprise wireless, transition mode has emerged as the practical migration path. After implementing WPA3 across diverse client environments throughout 2021-2022, I've identified the key strategies for successful transitions.",
    date: "2022-02-16",
    author: "Kris Armstrong",
    tags: ["Security", "WPA3", "Enterprise", "Best Practices"],
    featured: false,
    contentFile: "wpa3-transition-mode-best-practices-feb2022.md"
  },
  {
    id: "6ghz-channel-planning-design-mar2022",
    title: "6 GHz Channel Planning and Design: Lessons from Early Deployments",
    excerpt: "The 6 GHz band's 1200 MHz of clean spectrum fundamentally changes wireless channel planning. My 2022 deployments reveal that traditional 5 GHz design principles don't directly translate—6 GHz requires new thinking about channel width, power, and coverage.",
    date: "2022-03-22",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6E", "6 GHz", "Channel Planning", "RF Design", "Enterprise"],
    featured: false,
    contentFile: "6ghz-channel-planning-design-mar2022.md"
  },
  {
    id: "zero-trust-implementation-roadmap-apr2022",
    title: "Zero Trust Implementation Roadmap: From Concept to Reality",
    excerpt: "Zero Trust architecture has moved from buzzword to business requirement. After implementing Zero Trust frameworks across multiple enterprises in 2021-2022, I've developed a practical roadmap that delivers security improvements without disrupting operations.",
    date: "2022-04-18",
    author: "Kris Armstrong",
    tags: ["Zero Trust", "Security", "Enterprise", "Implementation"],
    featured: false,
    contentFile: "zero-trust-implementation-roadmap-apr2022.md"
  },
  {
    id: "ai-ml-network-management-may2022",
    title: "AI and ML in Network Management: Beyond the Marketing Hype",
    excerpt: "Every vendor now touts AI/ML capabilities in their wireless management platforms. Having evaluated and deployed multiple AI-driven solutions throughout 2022, I can separate genuine innovation from marketing rhetoric—and the reality is more nuanced than either extreme.",
    date: "2022-05-26",
    author: "Kris Armstrong",
    tags: ["AI/ML", "Network Management", "Cloud Management", "Enterprise"],
    featured: false,
    contentFile: "ai-ml-network-management-may2022.md"
  },
  {
    id: "multi-gigabit-ethernet-deployment-jun2022",
    title: "Multi-Gigabit Ethernet Deployment: 2.5/5/10GBASE-T in Practice",
    excerpt: "Wi-Fi 6 and 6E's aggregate throughput capabilities make multi-gigabit Ethernet no longer optional—it's essential infrastructure. My 2022 deployments across 2.5/5/10GBASE-T reveal the practical realities of upgrading from gigabit.",
    date: "2022-06-20",
    author: "Kris Armstrong",
    tags: ["Infrastructure", "Multi-Gigabit", "Ethernet", "Wi-Fi 6", "Enterprise"],
    featured: false,
    contentFile: "multi-gigabit-ethernet-deployment-jun2022.md"
  },
  {
    id: "wifi6-two-year-retrospective-jul2022",
    title: "Wi-Fi 6 Two-Year Retrospective: Mature Deployment Insights",
    excerpt: "Two years into enterprise Wi-Fi 6 deployments, 802.11ax has evolved from cutting-edge technology to stable, proven infrastructure. My experience across dozens of mature Wi-Fi 6 networks reveals what actually matters in production environments.",
    date: "2022-07-25",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6", "802.11ax", "Enterprise", "Retrospective", "Best Practices"],
    featured: false,
    contentFile: "wifi6-two-year-retrospective-jul2022.md"
  },
  {
    id: "network-automation-orchestration-aug2022",
    title: "Network Automation and Orchestration: Modern Enterprise Approaches",
    excerpt: "Manual network configuration and management can't scale to meet modern enterprise demands. My 2022 automation implementations demonstrate how infrastructure-as-code principles transform wireless network operations—when applied thoughtfully.",
    date: "2022-08-22",
    author: "Kris Armstrong",
    tags: ["Automation", "Network Management", "Infrastructure as Code", "Enterprise"],
    featured: false,
    contentFile: "network-automation-orchestration-aug2022.md"
  },
  {
    id: "private-5g-wifi-convergence-sep2022",
    title: "Private 5G and Wi-Fi Convergence: Enterprise Wireless Strategy",
    excerpt: "Private 5G networks are emerging as enterprise wireless options alongside Wi-Fi. Rather than competing technologies, my 2022 evaluations suggest they're complementary—when organizations understand their distinct strengths and use cases.",
    date: "2022-09-19",
    author: "Kris Armstrong",
    tags: ["Private 5G", "Wi-Fi", "Enterprise", "Network Strategy"],
    featured: false,
    contentFile: "private-5g-wifi-convergence-sep2022.md"
  },
  {
    id: "advanced-wpa3-security-oct2022",
    title: "Advanced WPA3 Security Features: SAE, OWE, and Enhanced Open",
    excerpt: "WPA3 provides more than just stronger encryption—it introduces fundamentally new security paradigms. My 2022 implementations of SAE, OWE, and Enhanced Open demonstrate how these protocols address long-standing wireless security challenges.",
    date: "2022-10-24",
    author: "Kris Armstrong",
    tags: ["Security", "WPA3", "Encryption", "Enterprise"],
    featured: false,
    contentFile: "advanced-wpa3-security-oct2022.md"
  },
  {
    id: "wifi6e-client-ecosystem-2022-nov2022",
    title: "Wi-Fi 6E Client Ecosystem: 2022 State of Adoption",
    excerpt: "Wi-Fi 6E's value depends entirely on client device support. My 2022 client tracking reveals 6E adoption accelerating faster than Wi-Fi 6 did—but with important caveats about device capabilities and real-world 6 GHz utilization.",
    date: "2022-11-21",
    author: "Kris Armstrong",
    tags: ["Wi-Fi 6E", "Client Devices", "6 GHz", "Enterprise"],
    featured: false,
    contentFile: "wifi6e-client-ecosystem-2022-nov2022.md"
  },
  {
    id: "2022-wireless-networking-retrospective-dec2022",
    title: "2022 Wireless Networking Retrospective: The Year of Wi-Fi 6E",
    excerpt: "2022 marked Wi-Fi 6E's transition from future technology to deployed reality, while Wi-Fi 6 reached full maturity. As the year closes, it's clear that 6 GHz spectrum and evolved security practices fundamentally reshaped enterprise wireless networking.",
    date: "2022-12-19",
    author: "Kris Armstrong",
    tags: ["Retrospective", "Wi-Fi 6E", "Wi-Fi 6", "Enterprise", "Industry Trends"],
    featured: false,
    contentFile: "2022-wireless-networking-retrospective-dec2022.md"
  }
];

// Helper function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function upload2022Posts() {
  console.log('='.repeat(60));
  console.log('UPLOADING 2022 BLOG POSTS TO SUPABASE');
  console.log('='.repeat(60));
  console.log(`\nFound ${posts2022.length} posts to upload\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts2022) {
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
      const { error } = await supabase
        .from('blog_posts')
        .insert([blogPostData])
        .select();

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
    console.log(`\n🎯 Target: 59 posts (23 + 12 + 12 + 12)`);
    console.log(`📈 Current: ${count} posts`);

    if (count === 59) {
      console.log(`\n🎉 SUCCESS! All 59 posts uploaded!`);
    } else if (count > 59) {
      console.log(`\n⚠️  WARNING: More posts than expected (${count} > 59)`);
    } else {
      console.log(`\n⚠️  Missing ${59 - count} posts`);
    }
  }
}

upload2022Posts().catch(console.error);
