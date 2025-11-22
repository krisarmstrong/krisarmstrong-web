import { Home, FileText, User, Mail, Code2, Cpu, BookOpen } from "lucide-react";
import type { NavItem } from "@krisarmstrong/web-foundation";

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", path: "/", icon: <Home size={18} /> },
  { label: "About", path: "/about", icon: <User size={18} /> },
  { label: "Resume", path: "/resume", icon: <FileText size={18} /> },
  { label: "Skills", path: "/skills", icon: <Cpu size={18} /> },
  { label: "Projects", path: "/projects", icon: <Code2 size={18} /> },
  { label: "Blog", path: "/blog", icon: <BookOpen size={18} /> },
  { label: "Contact", path: "/contact", icon: <Mail size={18} /> },
];
