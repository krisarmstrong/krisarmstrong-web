import baseConfig from '../../eslint.config.base.js';
import globals from 'globals';

/**
 * WiFi Vigilante app ESLint configuration
 * Extends the shared base configuration with app-specific overrides
 */
export default [
  ...baseConfig,
  {
    files: ['scripts/**'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
