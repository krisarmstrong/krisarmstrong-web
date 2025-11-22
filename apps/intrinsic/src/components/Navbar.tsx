import { Navbar as SharedNavbar, Button, ThemeToggle } from '@krisarmstrong/web-foundation';
import { PRIMARY_NAV } from '../config/navigation';

export default function Navbar() {
  return (
    <SharedNavbar
      logo={
        <div className="flex items-center gap-3">
          <img src="/logo-icon.png" alt="Intrinsic Momentum Mindset" className="h-12 w-12" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Intrinsic Momentum Mindset
            </span>
            <span className="text-sm text-text-muted">Coaching for leaders & creators</span>
          </div>
        </div>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="sage"
      desktopActions={
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="primary" as="a" href="/contact">
            Book a Consult
          </Button>
        </div>
      }
      mobileActions={
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="primary" as="a" href="/contact">
            Book a Consult
          </Button>
        </div>
      }
      mobileFooter={
        <div className="text-xs text-text-muted text-center">
          © {new Date().getFullYear()} Intrinsic Momentum Mindset
        </div>
      }
    />
  );
}
