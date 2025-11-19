import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon?: ReactNode;
  badge?: string;
  isExternal?: boolean;
}

export interface LegalLink {
  label: string;
  path: string;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface FooterProps {
  social?: Array<{ label: string; href: string; icon: ReactNode }>;
  legalLinks: LegalLink[];
  copyright: ReactNode;
  theme?: Theme;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export type Theme = 'dark' | 'light';
