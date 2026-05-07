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
export { useProgressiveLoad } from './hooks/useProgressiveLoad';
export { useReducedMotion } from './hooks/useReducedMotion';
// ============================================================================
// Hooks
// ============================================================================
export { useTheme as useSimpleTheme } from './hooks/useTheme';
export type { ErrorCallback, ErrorData, ErrorStats } from './utils/errorTracking';
export { errorTracker, setupErrorTracking, withErrorTracking } from './utils/errorTracking';
// ============================================================================
// Utils
// ============================================================================
export { initTheme } from './utils/initTheme';
export type { ValidationResult } from './utils/validation';
export * from './utils/validation';
