import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/web-foundation/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-brand-primary)',
        'brand-accent': 'var(--color-brand-accent)',
        'surface-base': 'var(--color-surface-base)',
        'surface-raised': 'var(--color-surface-raised)',
        'surface-border': 'var(--color-surface-border)',
        'surface-hover': 'var(--color-surface-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
        'text-accent': 'var(--color-text-accent)',
        'text-inverse': 'var(--color-text-inverse)',
        'interactive-default': 'var(--color-interactive-default)',
        'interactive-hover': 'var(--color-interactive-hover)',
        'interactive-active': 'var(--color-interactive-active)',
        'interactive-focus': 'var(--color-interactive-focus)',
        'interactive-disabled': 'var(--color-interactive-disabled)',
        'status-success': 'var(--color-status-success)',
        'status-warning': 'var(--color-status-warning)',
        'status-error': 'var(--color-status-error)',
        'status-info': 'var(--color-status-info)',
      },
    },
  },
};
