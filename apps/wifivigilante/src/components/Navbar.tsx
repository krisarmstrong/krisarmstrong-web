import { Shield } from "lucide-react";
import {
  Navbar as BaseNavbar,
  ThemeToggle,
  wifiVigilanteTheme,
  wifiVigilanteDarkTheme,
} from "@krisarmstrong/web-foundation";
import { PRIMARY_NAV } from "../config/navigation";

export default function Navbar() {
  return (
    <BaseNavbar
      logo={
        <>
          <Shield size={24} className="text-brand-primary group-hover:text-brand-accent transition-colors flex-shrink-0" />
          <span className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap text-text-primary">
            Wi-Fi Vigilante
          </span>
        </>
      }
      logoHref="/"
      navItems={PRIMARY_NAV}
      variant="blue"
      desktopActions={
        <ThemeToggle
          lightTheme={wifiVigilanteTheme}
          darkTheme={wifiVigilanteDarkTheme}
        />
      }
      mobileActions={
        <ThemeToggle
          lightTheme={wifiVigilanteTheme}
          darkTheme={wifiVigilanteDarkTheme}
        />
      }
      mobileFooter={
        <p className="text-xs text-text-muted text-center">
          © {new Date().getFullYear()} Wi-Fi Vigilante
        </p>
      }
    />
  );
}
