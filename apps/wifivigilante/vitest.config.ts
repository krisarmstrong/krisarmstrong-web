import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './src/tests/setup.ts',
  // Coverage thresholds: High coverage achieved
  coverageThresholds: {
    lines: 94,
    functions: 100,
    branches: 91,
    statements: 94,
  },
});
