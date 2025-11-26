import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './tests/setup.ts',
  // Coverage thresholds balanced for practical maintainability
  // Note: Function coverage is lower because callback props are harder to test in isolation
  coverageThresholds: {
    lines: 80,
    functions: 75,
    branches: 75,
    statements: 80,
  },
});
