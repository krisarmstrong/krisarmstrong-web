import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..', '..');
const sharedUiPath = resolve(workspaceRoot, 'packages', 'web-foundation');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['@krisarmstrong/web-foundation'],
    exclude: [],
  },
  server: {
    port: 3000,
    fs: {
      allow: [sharedUiPath, searchForWorkspaceRoot(process.cwd())],
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
          'vendor-ui': ['lucide-react', '@radix-ui/react-icons', '@krisarmstrong/web-foundation'],
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
});
