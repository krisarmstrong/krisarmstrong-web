import '@testing-library/jest-dom/vitest';
import { createLocalStorageMock, setupTestCleanup } from './src/test-utils';

// Setup localStorage mock
globalThis.localStorage = createLocalStorageMock();

// Setup automatic cleanup after each test
setupTestCleanup();
