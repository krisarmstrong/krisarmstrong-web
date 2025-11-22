import { Footer as SiteShellFooter } from '@krisarmstrong/web-foundation';
import { SOCIAL_LINKS, FOOTER_LINKS } from '../config/navigation';

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();
  return (
    <SiteShellFooter
      social={SOCIAL_LINKS}
      legalLinks={FOOTER_LINKS.legal.map((link) => ({ label: link.label, path: link.path }))}
      copyright={<span>&copy; {currentYear} Wi-Fi Vigilante. All rights reserved.</span>}
    />
  );
}
