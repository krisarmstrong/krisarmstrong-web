import { Calendar, FileText, Home, Info, Mail } from 'lucide-react';
import type { NavItem } from '@krisarmstrong/web-foundation';

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home size={18} /> },
  { label: 'About', path: '/about', icon: <Info size={18} /> },
  { label: 'Cases', path: '/cases', icon: <FileText size={18} /> },
  { label: 'Case of the Day', path: '/case-of-the-day', icon: <Calendar size={18} /> },
  { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
];
