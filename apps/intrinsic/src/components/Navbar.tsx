import { Navbar as SharedNavbar, ThemeToggle } from '@krisarmstrong/web-foundation';
import { PRIMARY_NAV } from '../config/navigation';

export default function Navbar() {
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
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-text-primary whitespace-nowrap">
            Intrinsic Momentum Mindset
          </span>
          <span className="text-sm text-text-muted hidden sm:block whitespace-nowrap">
            Coaching for leaders & creators
          </span>
        </div>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="sage"
      desktopActions={<ThemeToggle />}
      mobileActions={<ThemeToggle />}
      mobileFooter={
        <div className="text-xs text-text-muted text-center">
          © {new Date().getFullYear()} Intrinsic Momentum Mindset
        </div>
      }
    />
  );
}
