/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Violet variant (default, krisarmstrong)
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Blue variant (wifivigilante)
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Sage variant (intrinsic)
        sage: {
          DEFAULT: '#96A77A',
          dark: '#303F33',
          light: '#F8F6F1',
        },
        gold: {
          DEFAULT: '#CFB53B',
        },
        // Semantic colors
        primary: {
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
        accent: {
          DEFAULT: '#CFB53B',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#374151',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#111827',
        },
        text: {
          main: '#111827',
          muted: '#6b7280',
          subtle: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
};
