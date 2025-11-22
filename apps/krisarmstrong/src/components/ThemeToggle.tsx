import { useEffect, useState } from "react";

const THEME_KEY = "kris-armstrong-theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    // Check localStorage first, fall back to system preference
    const stored = localStorage.getItem(THEME_KEY);
    if (stored !== null) {
      return stored === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle("dark", dark);
    // Persist to localStorage
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === null) {
        setDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setDark((d) => !d)}
      className="ml-3 p-2 rounded-full bg-surface-raised hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
    >
      {dark ? "🌙" : "🌞"}
    </button>
  );
}
