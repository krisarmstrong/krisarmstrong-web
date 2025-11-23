import { Navbar as SharedNavbar, ThemeToggle, type NavItem } from '@krisarmstrong/web-foundation';
import { Home, FileText, User, Mail, Code2, Cpu, BookOpen } from 'lucide-react';

const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home size={18} /> },
  { label: 'About', path: '/about', icon: <User size={18} /> },
  { label: 'Resume', path: '/resume', icon: <FileText size={18} /> },
  { label: 'Skills', path: '/skills', icon: <Cpu size={18} /> },
  { label: 'Projects', path: '/projects', icon: <Code2 size={18} /> },
  { label: 'Blog', path: '/blog', icon: <BookOpen size={18} /> },
  { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
];

export default function Navbar() {
  const currentYear = new Date().getFullYear();

  return (
    <SharedNavbar
      logo={
        <img
          src="/kris-armstrong-avatar.jpeg"
          alt="Kris Armstrong"
          className="w-12 h-12 rounded-full object-cover border border-surface-border flex-shrink-0"
          loading="lazy"
        />
      }
      title={
        <span className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap text-text-primary">
          Kris Armstrong
        </span>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="violet"
      desktopActions={<ThemeToggle />}
      mobileActions={<ThemeToggle />}
      mobileFooter={
        <p className="text-xs text-text-muted text-center">© {currentYear} Kris Armstrong</p>
      }
    />
  );
}
