import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(dirname, '..', '..');
const sharedUiPath = path.resolve(workspaceRoot, 'packages', 'web-foundation');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  build: {
    // Optimize chunk size for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries chunk
          'vendor-ui': ['lucide-react', '@krisarmstrong/web-foundation'],
          // Sentry chunk (loaded on demand)
          'vendor-sentry': ['@sentry/react'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Increase chunk size warning limit for vendor bundles
    chunkSizeWarningLimit: 600,
    // Source maps for production debugging
    sourcemap: true,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3001,
    fs: {
      allow: [sharedUiPath, searchForWorkspaceRoot(process.cwd())],
    },
  },
});