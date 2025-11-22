import { Navbar as SharedNavbar, ThemeToggle } from '@krisarmstrong/web-foundation';
import { PRIMARY_NAV } from '../config/navigation';

export default function Navbar() {
  const currentYear = new Date().getFullYear();

  return (
    <SharedNavbar
      logo={
        <img
          src="/logo-icon.png"
          alt="Intrinsic Momentum Mindset"
          className="h-12 w-12 flex-shrink-0"
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
