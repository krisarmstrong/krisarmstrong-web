import { Navbar as SharedNavbar, ThemeToggle } from '@krisarmstrong/web-foundation';
import { PRIMARY_NAV } from '../config/navigation.tsx';

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
        <div className="flex flex-col">
          <span className="text-lg sm:text-xl font-bold tracking-wide text-text-primary whitespace-nowrap">
            Kris Armstrong
          </span>
          <span className="text-xs text-text-muted font-normal hidden sm:block whitespace-nowrap">
            CISSP | CWSP | CWDP | CWNA
          </span>
        </div>
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
