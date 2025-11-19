import { Navbar as SharedNavbar, Button, useTheme, intrinsicTheme, intrinsicDarkTheme } from "@krisarmstrong/web-foundation";
import { PRIMARY_NAV } from "../config/navigation";
import { Moon, Sun, Monitor } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

function IntrinsicThemeToggle() {
  const { mode, setMode, setTheme } = useTheme();
  const isDark = mode === 'dark';

  const toggleTheme = () => {
    if (isDark) {
      setMode('light');
      setTheme(intrinsicTheme);
    } else {
      setMode('dark');
      setTheme(intrinsicDarkTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-surface-raised text-text-primary border border-surface-border hover:bg-surface-hover"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Dark mode' : 'Light mode'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default function Navbar() {
  return (
    <div className="intrinsic-navbar">
    <SharedNavbar
      logo={
        <div className="flex items-center gap-3">
          <img
            src="/logo-icon.png"
            alt="Intrinsic Momentum Mindset"
            className="h-12 w-12"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Intrinsic Momentum Mindset
            </span>
            <span className="text-sm text-text-muted">
              Coaching for leaders & creators
            </span>
          </div>
        </div>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="sage"
      bgColor="bg-surface-raised"
      borderColor="border-surface-border"
      textColor="text-text-primary"
      desktopActions={
        <div className="flex items-center gap-3">
          <IntrinsicThemeToggle />
          <Button variant="primary" as="a" href="/contact">
            Book a Consult
          </Button>
        </div>
      }
      mobileActions={
        <Button variant="primary" as="a" href="/contact">
          Book a Consult
        </Button>
      }
    />
 
    </div>
  );
}
