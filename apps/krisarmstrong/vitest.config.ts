import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './tests/setup.ts',
  // Coverage thresholds: High coverage achieved
  // Note: Some branches (URL params disabled in test mode) and functions (callback props) aren't testable in unit tests
  coverageThresholds: {
    lines: 97,
    functions: 92,
    branches: 83,
    statements: 96,
  },
});
