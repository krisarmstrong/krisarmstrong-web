import { Sun, Moon } from "lucide-react";
import {
  Navbar as SharedNavbar,
  useTheme,
  krisArmstrongTheme,
  krisArmstrongDarkTheme,
} from "@krisarmstrong/web-foundation";
import { PRIMARY_NAV } from "../config/navigation.tsx";

function KrisArmstrongThemeToggle() {
  const { mode, setMode, setTheme } = useTheme();
  const isDark = mode === 'dark';

  const toggleTheme = () => {
    if (isDark) {
      setMode('light');
      setTheme(krisArmstrongTheme);
    } else {
      setMode('dark');
      setTheme(krisArmstrongDarkTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-interactive-default/10 text-interactive-default border border-interactive-default/30 hover:bg-interactive-default/20"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Dark mode' : 'Light mode'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default function Navbar() {
  const currentYear = new Date().getFullYear();

  return (
    <SharedNavbar
      logo={
        <div className="flex items-center gap-3">
          <img
            src="/kris-armstrong-avatar.jpeg"
            alt="Kris Armstrong"
            className="w-12 h-12 rounded-full object-cover border border-surface-border"
            loading="lazy"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-wide text-text-primary">
              Kris Armstrong
            </span>
            <span className="text-xs text-text-muted font-normal hidden sm:block">
              CISSP | CWSP | CWDP | CWNA
            </span>
          </div>
        </div>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="violet"
      desktopActions={<KrisArmstrongThemeToggle />}
      mobileActions={<KrisArmstrongThemeToggle />}
      mobileFooter={
        <p className="text-xs text-text-muted text-center">
          © {currentYear} Kris Armstrong
        </p>
      }
    />
  );
}
