import baseConfig from '../../eslint.config.base.js';
import tseslint from 'typescript-eslint';

const tsTypeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: ['**/*.{ts,tsx,cts,mts}'],
}));

/**
 * Intrinsic app ESLint configuration
 * Extends the shared base configuration and enables type-aware linting for
 * application, scripts, and tooling files via tsconfig.eslint.json.
 */
export default [
  ...baseConfig,
  ...tseslint.config(
    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.eslint.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    ...tsTypeCheckedConfigs,
  ),
];
