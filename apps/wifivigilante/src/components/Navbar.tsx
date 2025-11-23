import { Shield, Calendar, FileText, Home, Info, Mail } from 'lucide-react';
import { Navbar as SharedNavbar, ThemeToggle, type NavItem } from '@krisarmstrong/web-foundation';

const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home size={18} /> },
  { label: 'About', path: '/about', icon: <Info size={18} /> },
  { label: 'Cases', path: '/cases', icon: <FileText size={18} /> },
  { label: 'Case of the Day', path: '/case-of-the-day', icon: <Calendar size={18} /> },
  { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
];

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
