import { Navbar as SharedNavbar, ThemeToggle, type NavItem } from '@krisarmstrong/web-foundation';
import { Home, Info, Briefcase, Mail } from 'lucide-react';

const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home size={18} /> },
  { label: 'About', path: '/about', icon: <Info size={18} /> },
  { label: 'Services', path: '/services', icon: <Briefcase size={18} /> },
  { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
];

export default function Navbar() {
  const currentYear = new Date().getFullYear();

  return (
    <SharedNavbar
      logo={
        <img
          src="/logo-icon.png"
          alt="Intrinsic Momentum Mindset"
          className="h-12 w-12 flex-shrink-0"
          loading="lazy"
        />
      }
      title={
        <span className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap text-text-primary">
          Intrinsic Momentum Mindset
        </span>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="sage"
      desktopActions={<ThemeToggle />}
      mobileActions={<ThemeToggle />}
      mobileFooter={
        <p className="text-xs text-text-muted text-center">
          © {currentYear} Intrinsic Momentum Mindset
        </p>
      }
    />
  );
}
