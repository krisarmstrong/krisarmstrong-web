import { Shield } from 'lucide-react';
import { Navbar as SharedNavbar, ThemeToggle } from '@krisarmstrong/web-foundation';
import { PRIMARY_NAV } from '../config/navigation';

export default function Navbar() {
  const currentYear = new Date().getFullYear();

  return (
    <SharedNavbar
      logo={
        <Shield
          size={48}
          className="text-brand-primary group-hover:text-brand-accent transition-colors flex-shrink-0"
        />
      }
      title={
        <span className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap text-text-primary">
          Wi-Fi Vigilante
        </span>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="blue"
      desktopActions={<ThemeToggle />}
      mobileActions={<ThemeToggle />}
      mobileFooter={
        <p className="text-xs text-text-muted text-center">© {currentYear} Wi-Fi Vigilante</p>
      }
    />
  );
}
