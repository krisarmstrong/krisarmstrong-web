import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, searchForWorkspaceRoot, type UserConfig } from 'vite';

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
  const vendorChunks: Record<string, string[]> = {
    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
    'vendor-ui': ['lucide-react', '@krisarmstrong/web-foundation'],
    'vendor-query': ['@tanstack/react-query'],
    'vendor-motion': ['framer-motion'],
    'vendor-markdown': ['react-markdown', 'rehype-sanitize'],
    'vendor-sentry': ['@sentry/react'],
    ...appConfig.vendorChunks,
  };

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
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }
            for (const [chunkName, packages] of Object.entries(vendorChunks)) {
              if (packages.some((packageName) => id.includes(`/node_modules/${packageName}/`))) {
                return chunkName;
              }
            }
            return 'vendor';
          },
        },
      },
      // Target modern browsers for smaller bundles
      target: 'esnext',
      // CSS code splitting - each chunk gets its own CSS file
      cssCodeSplit: true,
      // Asset inlining threshold - inline small assets as base64
      assetsInlineLimit: 4096,
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
