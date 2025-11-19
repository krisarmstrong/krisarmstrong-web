import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts', // Assuming a setup file will be created here
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
    },
  },
});
