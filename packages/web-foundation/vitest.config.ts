import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: './vitest.setup.ts',
  // Coverage thresholds: High coverage achieved
  // Functions slightly lower due to callback props in shared components
  coverageThresholds: {
    lines: 92,
    functions: 89,
    branches: 90,
    statements: 92,
  },
});
