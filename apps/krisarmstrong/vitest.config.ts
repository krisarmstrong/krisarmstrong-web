import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './tests/setup.ts',
  // Coverage thresholds: 90% for statements/lines, 80-85% for branches/functions
  // Note: Some branches (URL params) and functions (callback props) are harder to test in isolation
  coverageThresholds: {
    lines: 90,
    functions: 85,
    branches: 80,
    statements: 90,
  },
});
