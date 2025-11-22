import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  outDir: 'dist',
  metafile: true,
  external: ['react', 'react-dom', 'react-router-dom', '@sentry/react', 'lucide-react'],
});
