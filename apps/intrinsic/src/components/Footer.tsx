import { Footer as SharedFooter } from "@krisarmstrong/web-foundation";
import { FOOTER_LINKS, SOCIAL_LINKS } from "../config/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <SharedFooter
      social={SOCIAL_LINKS}
      legalLinks={FOOTER_LINKS.legal.map(link => ({ label: link.label, path: link.to }))}
      copyright={<span>&copy; {currentYear} Intrinsic Momentum Mindset. All rights reserved.</span>}
    />
  );
}
