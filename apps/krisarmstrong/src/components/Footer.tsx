import { Footer as SiteShellFooter } from '@krisarmstrong/web-foundation';
import { SOCIAL_LINKS, FOOTER_LINKS } from '../config/navigation.tsx';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <SiteShellFooter
      social={SOCIAL_LINKS}
      legalLinks={FOOTER_LINKS.legal.map((link) => ({ label: link.label, path: link.path }))}
      copyright={<span>&copy; {currentYear} Kris Armstrong. All rights reserved.</span>}
    />
  );
}
