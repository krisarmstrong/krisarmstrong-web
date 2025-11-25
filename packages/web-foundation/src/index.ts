// Theme system
export { ThemeToggle } from './components/ThemeToggle';
export type { ThemeToggleProps } from './components/ThemeToggle';
export { useTheme as useSimpleTheme } from './hooks/useTheme';
export { initTheme } from './utils/initTheme';

// Layout
export { PageShell } from './components/PageShell';
export { TailwindSafelist } from './components/TailwindSafelist';

// UI Components
export { Button } from './components/ui/Button';
export type { ButtonProps } from './components/ui/Button';
export {
  H1,
  H2,
  ArticleTitle,
  SubSectionTitle,
  CardTitle,
  P,
  SmallText,
  MutedText,
  AccentLink,
  Tag,
  Badge,
} from './components/ui/Typography';

// Forms
export { ContactForm } from './components/ContactForm';

// Display
export { StarRating } from './components/StarRating';
export { AggregateRating } from './components/AggregateRating';
export type { AggregateRatingProps, RatingStats, RatingAPI } from './components/AggregateRating';
export { StatCard } from './components/StatCard';
export type { StatCardProps, StatCardSize, StatCardColorScheme } from './components/StatCard';

// Error Handling
export { ErrorBoundary, ErrorMessage, ErrorCard, ErrorPage } from './components/Error';
export type {
  ErrorMessageProps,
  ErrorCardProps,
  ErrorPageProps,
  ErrorBoundaryProps,
} from './components/Error';

// Loading States
export {
  LoadingSpinner,
  LoadingCard,
  LoadingPage,
  Skeleton,
  SkeletonText,
  SkeletonCard,
} from './components/Loading';
export type {
  LoadingSpinnerProps,
  LoadingCardProps,
  LoadingPageProps,
  SkeletonProps,
  SkeletonTextProps,
} from './components/Loading';

// Content Components
export { ContentCard } from './components/ContentCard';
export { ContentSearch } from './components/ContentSearch';
export { ContentSort } from './components/ContentSort';
export { ActiveFilterBadges } from './components/ActiveFilterBadges';
export type { ActiveFilter } from './components/ActiveFilterBadges';
export { LoadMoreButton } from './components/LoadMoreButton';
export { EmptyState } from './components/EmptyState';
export { SiteSearch } from './components/SiteSearch';
export type { SearchResult } from './components/SiteSearch';

// Hooks
export { useProgressiveLoad } from './hooks/useProgressiveLoad';

// Validation
export * from './utils/validation';
export type { ValidationResult } from './utils/validation';
