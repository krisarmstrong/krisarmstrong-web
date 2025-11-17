import { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PrimaryNav } from './PrimaryNav';
import type { NavItem } from '../types';
import { useOptionalTheme } from '../context/ThemeContext';

type NavVariant = 'violet' | 'blue' | 'sage' | 'default';

interface NavbarProps {
  /** Logo element - can be text, image, or custom component */
  logo: ReactNode;
  /** URL for logo link (usually '/') */
  logoHref?: string;
  /** Navigation items */
  navItems: NavItem[];
  /** Color variant for active states */
  variant?: NavVariant;
  /** Additional content for desktop (e.g., Search, CTA button) */
  desktopActions?: ReactNode;
  /** Additional content for mobile drawer (e.g., Search) */
  mobileActions?: ReactNode;
  /** Additional content for mobile drawer footer */
  mobileFooter?: ReactNode;
  /** Background color classes */
  bgColor?: string;
  /** Border color classes */
  borderColor?: string;
  /** Text color classes */
  textColor?: string;
  /** Accent color for focus states */
  accentColor?: string;
}

const variantColors: Record<
  NavVariant,
  { bg: string; border: string; text: string; accent: string }
> = {
  violet: {
    bg: 'bg-gray-900',
    border: 'border-gray-800',
    text: 'text-white',
    accent: 'focus:ring-violet-500',
  },
  blue: {
    bg: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-white',
    accent: 'focus:ring-blue-500',
  },
  sage: {
    bg: 'bg-background',
    border: 'border-border',
    text: 'text-text-main',
    accent: 'focus:ring-accent',
  },
  default: {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-900',
    accent: 'focus:ring-blue-500',
  },
};

export function Navbar({
  logo,
  logoHref = '/',
  navItems,
  variant = 'violet',
  desktopActions,
  mobileActions,
  mobileFooter,
  bgColor,
  borderColor,
  textColor,
  accentColor,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use theme context if available, otherwise fall back to variants
  const themeContext = useOptionalTheme();
  const theme = themeContext?.theme;

  const colors = variantColors[variant];
  const finalBgColor = theme ? '' : bgColor || colors.bg;
  const finalBorderColor = theme ? '' : borderColor || colors.border;
  const finalTextColor = theme ? '' : textColor || colors.text;
  const finalAccentColor = accentColor || colors.accent;

  // Build inline styles from theme if available
  const navStyle: CSSProperties = theme
    ? {
        backgroundColor: theme.surface?.base,
        borderColor: theme.surface?.border,
        color: theme.text?.primary,
      }
    : {};

  const drawerStyle: CSSProperties = theme
    ? {
        backgroundColor: theme.surface?.raised,
        borderColor: theme.surface?.border,
      }
    : {};

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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 ${finalBgColor} ${finalTextColor} focus:rounded-lg focus:shadow-lg ${finalAccentColor}`}
      >
        Skip to content
      </a>

      <nav
        className={`w-full ${theme ? '' : finalBgColor} ${theme ? '' : finalTextColor} shadow-md px-4 sm:px-6 py-4 flex items-center justify-between z-40 sticky top-0 backdrop-blur-sm bg-opacity-95 border-b ${theme ? '' : finalBorderColor}`}
        style={navStyle}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to={logoHref}
          className={`flex items-center gap-3 hover:opacity-90 transition-opacity ${finalAccentColor} focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg px-2 py-1`}
          onClick={closeMenu}
        >
          {logo}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          <PrimaryNav items={navItems} variant={variant === 'default' ? 'violet' : variant} />
          {desktopActions}
        </div>

        {/* Mobile: Hamburger */}
        <button
          className={`lg:hidden ${finalAccentColor} focus:outline-none focus:ring-2 rounded-lg p-2 hover:bg-opacity-10 transition-colors`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu - Slide-in Drawer */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <div
              ref={menuRef}
              className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] ${finalBgColor} border-l ${finalBorderColor} z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col`}
              style={drawerStyle}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between p-4 border-b ${finalBorderColor}`}
                style={theme ? { borderColor: theme.surface?.border } : {}}
              >
                <div className="flex items-center gap-2">{logo}</div>
                <button
                  className={`${finalAccentColor} focus:outline-none focus:ring-2 rounded-lg p-2 transition-colors`}
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Actions (e.g., Search) */}
              {mobileActions && <div className="px-4 pt-4">{mobileActions}</div>}

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <PrimaryNav
                  items={navItems}
                  orientation="vertical"
                  variant={variant === 'default' ? 'violet' : variant}
                  onNavigate={closeMenu}
                />
              </nav>

              {/* Footer */}
              {mobileFooter && (
                <div
                  className={`p-6 border-t ${finalBorderColor}`}
                  style={theme ? { borderColor: theme.surface?.border } : {}}
                >
                  {mobileFooter}
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
}
