import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './vitest.setup.ts',
  // Coverage thresholds: 90% for statements/branches/lines, 89% for functions
  // Functions slightly lower due to callback props in shared components
  coverageThresholds: {
    lines: 90,
    functions: 89,
    branches: 90,
    statements: 90,
  },
});
