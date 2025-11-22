import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './vitest.setup.ts',
  // Current coverage: 61% statements, 51% branches, 59% functions, 60% lines
  // Set realistic thresholds, increase over time
  coverageThresholds: {
    lines: 60,
    functions: 55,
    branches: 50,
    statements: 60,
  },
});
