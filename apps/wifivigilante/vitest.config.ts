import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './src/tests/setup.ts',
  // Coverage thresholds: 90%+ across all metrics
  coverageThresholds: {
    lines: 90,
    functions: 90,
    branches: 90,
    statements: 90,
  },
});
