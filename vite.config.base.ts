import { defineConfig, searchForWorkspaceRoot, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * Configuration options for creating a Vite config
 */
export interface AppConfig {
  /** App name for chunk naming */
  appName: string;
  /** Development server port */
  port: number;
  /** Additional vendor chunks (optional) */
  vendorChunks?: Record<string, string[]>;
}

/**
 * Creates a standardized Vite configuration for apps in the monorepo
 * @param appConfig - App-specific configuration options
 * @returns Vite configuration object
 */
export function createViteConfig(appConfig: AppConfig): UserConfig {
  const plugins = [react(), tailwindcss()];

  // Add bundle analyzer when ANALYZE env var is set
  if (process.env.ANALYZE === 'true') {
    plugins.push(
      visualizer({
        filename: `dist/stats-${appConfig.appName}.html`,
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // 'treemap', 'sunburst', 'network'
      })
    );
  }

  return defineConfig({
    plugins,

    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },

    optimizeDeps: {
      include: ['@krisarmstrong/web-foundation'],
      exclude: [],
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
            // Merge any additional app-specific vendor chunks
            ...appConfig.vendorChunks,
          },
        },
      },
      // Target modern browsers for smaller bundles
      target: 'esnext',
      // Chunk size warning limit (lowered from 600KB for better bundle awareness)
      chunkSizeWarningLimit: 400,
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
      port: appConfig.port,
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          path.resolve(process.cwd(), '../../packages/web-foundation'),
        ],
      },
    },
  });
}
