import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './tests/setup.ts',
  // Current coverage: 87%+ across all metrics
  // Setting thresholds at 80% to maintain quality while allowing some flexibility
  coverageThresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80,
  },
});
