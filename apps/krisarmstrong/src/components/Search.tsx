import { SiteSearch, type SearchResult } from "@krisarmstrong/web-foundation";
import blogPosts from "../content/blog/blog-posts.json";

// Generate searchable content dynamically
const generateSearchableContent = (): SearchResult[] => {
  const staticContent: SearchResult[] = [
    // Pages
    { title: "Home", path: "/", excerpt: "$33M Revenue Impact, Wi-Fi Vigilante Platform, CISSP + Wireless Expert", type: "page" },
    { title: "About", path: "/about", excerpt: "Sales Engineer, Systems Engineer, Network Engineer with expertise in Wi-Fi 6/6E/7 infrastructure", type: "page" },
    { title: "Skills", path: "/skills", excerpt: "Network Engineering, Security Architecture, Cloud Platforms, Programming & Automation", type: "page" },
    { title: "Projects", path: "/projects", excerpt: "Wi-Fi Vigilante, test-accessory-finder, niac-go, netally-tools, eap-test-suite", type: "page" },
    { title: "Blog", path: "/blog", excerpt: "Technical blog with case studies, deep dives, and lessons learned", type: "page" },
    { title: "Resume", path: "/resume", excerpt: "Senior Sales Engineer driving $33M+ revenue in networking and cybersecurity", type: "page" },
    { title: "Contact", path: "/contact", excerpt: "Get in touch for consulting opportunities", type: "page" },

    // Certifications
    { title: "CISSP", path: "/skills", excerpt: "Certified Information Systems Security Professional", type: "cert" },
    { title: "CWSP", path: "/skills", excerpt: "Certified Wireless Security Professional", type: "cert" },
    { title: "CWDP", path: "/skills", excerpt: "Certified Wireless Design Professional", type: "cert" },
    { title: "CWNA", path: "/skills", excerpt: "Certified Wireless Network Administrator", type: "cert" },

    // Skills
    { title: "Network Engineering", path: "/skills", excerpt: "Enterprise Wired & Wireless Wi-Fi 6/6E/7 Infrastructure Design & Deployment", type: "skill" },
    { title: "Security Architecture", path: "/skills", excerpt: "CISSP, Wireless Security, Zero Trust Principles, PCI DSS, ISO 27001", type: "skill" },
    { title: "Cloud Platforms", path: "/skills", excerpt: "AWS, Azure, Hybrid Cloud Solutions", type: "skill" },
    { title: "Programming & Automation", path: "/skills", excerpt: "Python, Go, TypeScript, JavaScript, Ansible, CI/CD", type: "skill" },
    { title: "Wireless Technologies", path: "/skills", excerpt: "RF Planning, Site Surveys, Spectrum Analysis, Capacity Planning", type: "skill" },

    // Projects
    { title: "Wi-Fi Vigilante", path: "/projects", excerpt: "Comprehensive network investigation and troubleshooting platform", type: "project" },
    { title: "test-accessory-finder", path: "/projects", excerpt: "Network scanner for NetAlly Test Accessories running iPerf3 servers", type: "project" },
    { title: "niac-go", path: "/projects", excerpt: "Production-ready network device simulator with YAML configuration", type: "project" },
    { title: "netally-tools", path: "/projects", excerpt: "Comprehensive toolkit for NetAlly hardware devices", type: "project" },
    { title: "eap-test-suite", path: "/projects", excerpt: "Automated testing suite for EAP authentication methods", type: "project" },
  ];

  // Blog Posts - dynamically loaded from JSON
  const blogContent: SearchResult[] = blogPosts
    .filter(post => post.id !== "README")
    .map(post => ({
      title: post.title,
      path: `/blog/${post.id}`,
      excerpt: post.excerpt,
      type: "blog"
    }));

  return [...staticContent, ...blogContent];
};

export default function Search() {
  return (
    <SiteSearch
      searchableContent={generateSearchableContent()}
      placeholder="Search skills, projects, certifications..."
      variant="violet"
    />
  );
}
