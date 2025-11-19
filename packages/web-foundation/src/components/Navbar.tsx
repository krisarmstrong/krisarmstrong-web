import { useState, useEffect, useRef, ReactNode } from 'react';
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
  const finalBgColor = theme ? 'bg-surface-raised' : bgColor || colors.bg;
  const finalBorderColor = theme ? 'border-surface-border' : borderColor || colors.border;
  const finalTextColor = theme ? 'text-text-primary' : textColor || colors.text;
  const finalAccentColor = accentColor || colors.accent;

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

  return (
    <>
      <nav
        className={`relative w-full ${finalBgColor} ${finalTextColor} shadow-md px-4 sm:px-6 py-4 flex items-center justify-between z-40 sticky top-0 backdrop-blur-sm bg-opacity-95 border-b ${finalBorderColor}`}
        style={{}}
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
        <div className="hidden md:flex items-center gap-4">
          <PrimaryNav items={navItems} variant={variant === 'default' ? 'violet' : variant} />
          {desktopActions}
        </div>

        {/* Mobile Menu Container */}
        <div className="md:hidden relative">
          {/* Hamburger Button */}
          <button
            className={`text-inherit ${finalAccentColor} focus:outline-none focus:ring-2 rounded-lg p-2 hover:bg-opacity-10 transition-colors`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Backdrop */}
          {menuOpen && (
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') closeMenu();
              }}
            />
          )}

          {/* Mobile Menu - Dropdown */}
          {menuOpen && (
            <div
              ref={menuRef}
              className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-2xl ${finalBgColor} ${finalTextColor} border-2 ${finalBorderColor} animate-in fade-in slide-in-from-top-2 duration-300 z-[9999]`}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Mobile Actions */}
              {mobileActions && (
                <div className={`p-4 border-b ${finalBorderColor}`}>{mobileActions}</div>
              )}

              {/* Navigation Links */}
              <nav className="py-2">
                <PrimaryNav
                  items={navItems}
                  orientation="vertical"
                  variant={variant === 'default' ? 'violet' : variant}
                  onNavigate={closeMenu}
                />
              </nav>

              {/* Desktop Actions in Mobile Menu */}
              {desktopActions && (
                <div className={`p-4 border-t ${finalBorderColor}`}>{desktopActions}</div>
              )}

              {/* Footer */}
              {mobileFooter && (
                <div className={`p-4 border-t ${finalBorderColor}`}>{mobileFooter}</div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
