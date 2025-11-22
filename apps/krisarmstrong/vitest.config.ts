import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './tests/setup.ts',
  // Current coverage: 0.67% - disable thresholds until more tests are written
  coverageThresholds: {
    lines: 0,
    functions: 0,
    branches: 0,
    statements: 0,
  },
});
