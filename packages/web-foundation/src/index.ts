/**
 * @krisarmstrong/web-foundation
 *
 * Shared component library for krisarmstrong.com and wifivigilante.com
 *
 * @example
 * import { Button, ContentCard, LoadingPage } from '@krisarmstrong/web-foundation';
 */

// ============================================================================
// Components - All UI components organized by category
// ============================================================================
export * from './components';

// ============================================================================
// Hooks
// ============================================================================
export { useTheme as useSimpleTheme } from './hooks/useTheme';
export { useProgressiveLoad } from './hooks/useProgressiveLoad';
export { useReducedMotion } from './hooks/useReducedMotion';

// ============================================================================
// Utils
// ============================================================================
export { initTheme } from './utils/initTheme';
export * from './utils/validation';
export type { ValidationResult } from './utils/validation';
export { errorTracker, setupErrorTracking, withErrorTracking } from './utils/errorTracking';
export type { ErrorData, ErrorStats, ErrorCallback } from './utils/errorTracking';
