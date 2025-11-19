import { Navbar as SharedNavbar, Button, useTheme, intrinsicTheme, intrinsicDarkTheme } from "@krisarmstrong/web-foundation";
import { PRIMARY_NAV } from "../config/navigation";
import { Moon, Sun, Monitor } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

function IntrinsicThemeToggle() {
  const { mode, setMode, setTheme } = useTheme();
  const [actualMode, setActualMode] = useState<'light' | 'dark'>('light');

  // Determine the actual rendered mode (for 'auto', check system preference)
  useEffect(() => {
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualMode(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setActualMode(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setActualMode(mode);
    }
  }, [mode]);

  const toggleTheme = useCallback(() => {
    // Cycle through: light -> dark -> auto -> light
    if (mode === 'light') {
      setMode('dark');
      setTheme(intrinsicDarkTheme);
    } else if (mode === 'dark') {
      setMode('auto');
      // For auto mode, set theme based on current system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? intrinsicDarkTheme : intrinsicTheme);
    } else {
      setMode('light');
      setTheme(intrinsicTheme);
    }
  }, [mode, setMode, setTheme]);

  const getIcon = () => {
    if (mode === 'auto') return <Monitor size={18} />;
    return actualMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />;
  };

  const getLabel = () => {
    if (mode === 'auto') return 'Switch to light mode';
    return actualMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-surface-raised text-text-primary border border-surface-border hover:bg-surface-hover"
      aria-label={getLabel()}
      title={mode === 'auto' ? 'Auto (follows system)' : `${mode === 'dark' ? 'Dark' : 'Light'} mode`}
    >
      {getIcon()}
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
