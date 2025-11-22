import { useState, useEffect, useRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PrimaryNav } from './PrimaryNav';
import type { NavItem } from '../types';

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
    bg: 'bg-surface-raised',
    border: 'border-surface-border',
    text: 'text-text-primary',
    accent: 'focus:ring-brand-primary',
  },
  blue: {
    bg: 'bg-surface-raised',
    border: 'border-surface-border',
    text: 'text-text-primary',
    accent: 'focus:ring-brand-primary',
  },
  sage: {
    bg: 'bg-surface-raised',
    border: 'border-surface-border',
    text: 'text-text-primary',
    accent: 'focus:ring-brand-primary',
  },
  default: {
    bg: 'bg-surface-raised',
    border: 'border-surface-border',
    text: 'text-text-primary',
    accent: 'focus:ring-brand-primary',
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

  const colors = variantColors[variant];
  const finalBgColor = bgColor || colors.bg;
  const finalBorderColor = borderColor || colors.border;
  const finalTextColor = textColor || colors.text;
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
        <div style={{ display: 'none' }} className="desktop-nav">
          <div className="flex items-center gap-4">
            <PrimaryNav items={navItems} variant={variant === 'default' ? 'violet' : variant} />
            {desktopActions}
          </div>
        </div>

        {/* Mobile Menu Hamburger */}
        <div style={{ display: 'block' }} className="mobile-hamburger">
          <button
            className={`text-inherit ${finalAccentColor} focus:outline-none focus:ring-2 rounded-lg p-2 hover:bg-opacity-10 transition-colors`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
        }
      `}</style>

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
          className={`rounded-lg shadow-2xl ${finalBgColor} ${finalTextColor} border-2 ${finalBorderColor} transition-all duration-200 ease-in-out`}
          style={{
            position: 'fixed',
            right: '1rem',
            top: '5rem',
            width: '18rem',
            zIndex: 60,
          }}
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
          {mobileFooter && <div className={`p-4 border-t ${finalBorderColor}`}>{mobileFooter}</div>}
        </div>
      )}
    </>
  );
}
