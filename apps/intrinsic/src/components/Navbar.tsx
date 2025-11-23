import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Info, Briefcase, Mail } from 'lucide-react';
import { ThemeToggle } from '@krisarmstrong/web-foundation';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: <Home size={18} /> },
  { label: 'About', path: '/about', icon: <Info size={18} /> },
  { label: 'Services', path: '/services', icon: <Briefcase size={18} /> },
  { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(72);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  const closeMenu = () => setMenuOpen(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && menuOpen) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Update navbar height for mobile menu positioning
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="relative w-full min-h-[72px] bg-surface-raised text-text-primary shadow-md px-4 sm:px-6 py-4 flex items-center justify-between z-40 sticky top-0 backdrop-blur-sm bg-opacity-95 border-b border-surface-border"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo and Title */}
        <div className="flex items-center gap-3 flex-shrink min-w-0">
          <Link
            to="/"
            className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity focus:ring-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg px-2 py-1"
            onClick={closeMenu}
          >
            <img
              src="/logo-48.png"
              srcSet="/logo-48.png 1x, /logo-56@2x.png 2x"
              alt="Intrinsic Momentum Mindset"
              className="w-12 h-12 sm:w-14 sm:h-14 transition-opacity flex-shrink-0"
            />
          </Link>
          <span className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap text-text-primary">
            Intrinsic Momentum Mindset
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-auto">
          <div className="flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-primary hover:bg-brand-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Hamburger - ONLY visible on mobile */}
        <button
          className="md:hidden flex text-inherit focus:ring-brand-primary focus:outline-none focus:ring-2 rounded-lg p-2 hover:bg-opacity-10 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Backdrop - Rendered outside nav */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') closeMenu();
          }}
        />
      )}

      {/* Mobile Menu - Fixed position overlay */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="rounded-lg shadow-2xl bg-surface-raised text-text-primary border-2 border-surface-border transition-all duration-200 ease-in-out"
          style={{
            position: 'fixed',
            right: '1rem',
            top: `${navHeight + 8}px`,
            width: '18rem',
            zIndex: 60,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Theme Toggle */}
          <div className="p-4 border-b border-surface-border">
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-brand-primary hover:text-white transition-colors duration-200"
                onClick={closeMenu}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-surface-border">
            <p className="text-xs text-text-muted text-center">
              © {currentYear} Intrinsic Momentum Mindset
            </p>
          </div>
        </div>
      )}
    </>
  );
}
