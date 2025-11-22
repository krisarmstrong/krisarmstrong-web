import { SiteSearch, type SearchResult } from "@krisarmstrong/web-foundation";

// Generate searchable content for WiFi Vigilante
const searchableContent: SearchResult[] = [
  // Pages
  { title: "Home", path: "/", excerpt: "Real-world wireless network investigations and case studies", type: "page" },
  { title: "About", path: "/about", excerpt: "About Wi-Fi Vigilante - Network investigation platform", type: "page" },
  { title: "Cases", path: "/cases", excerpt: "Browse all wireless network investigation case files", type: "page" },
  { title: "Case of the Day", path: "/case-of-the-day", excerpt: "Featured case study of the day", type: "page" },
  { title: "Contact", path: "/contact", excerpt: "Get in touch for consulting and investigation services", type: "page" },

  // Common sectors
  { title: "Healthcare Cases", path: "/cases", excerpt: "Wireless network investigations in healthcare environments", type: "sector" },
  { title: "Education Cases", path: "/cases", excerpt: "Campus and educational wireless network case studies", type: "sector" },
  { title: "Retail Cases", path: "/cases", excerpt: "Commercial and retail wireless investigations", type: "sector" },
  { title: "Enterprise Cases", path: "/cases", excerpt: "Corporate enterprise wireless case studies", type: "sector" },
];

export default function Search() {
  return (
    <SiteSearch
      searchableContent={searchableContent}
      placeholder="Search cases, sectors, pages..."
      variant="blue"
    />
  );
}
