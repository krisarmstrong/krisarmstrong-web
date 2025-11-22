import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './src/tests/setup.ts',
  // Current coverage: 81% statements, 83% branches, 66% functions, 81% lines
  // Set realistic thresholds, increase over time
  coverageThresholds: {
    lines: 80,
    functions: 65,
    branches: 80,
    statements: 80,
  },
});
