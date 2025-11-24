// Type definitions for Wi-Fi Vigilante

// ============================================================================
// Database Models
// ============================================================================

export interface Sector {
  id: number;
  name: string;
  description?: string;
}

export interface Subsector {
  id: number;
  name: string;
  description?: string;
  sector_id: number;
}

export interface CaseFile {
  id?: number;
  public_id: string;
  title: string;
  sector_id: number;
  subsector_id?: number | null;
  tool?: string | null;
  location?: string | null;
  category?: string | null;
  incident_date: string;
  tags?: string | null;
  incident_overview: string;
  investigation_breakdown?: string | null;
  root_cause?: string | null;
  resolution?: string | null;
  verdict?: string | null;
  summary?: string | null;
  detected_by?: string | null;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  impact_scope?: string | null;
  duration_minutes?: number | null;
  validated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Transformed/Display Models
// ============================================================================

export interface TransformedCase {
  [key: string]: unknown;
  id: number;
  publicId: string;
  title: string;
  sectorId: number;
  sector: string;
  subsectorId?: number;
  subsector?: string;
  tool?: string;
  location?: string;
  category?: string;
  incidentDate: string;
  displayDate: string;
  tags: string[];
  incidentOverview: string;
  investigationBreakdown?: string;
  rootCause?: string;
  resolution?: string;
  verdict?: string;
  summary?: string;
  detectedBy?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  impactScope?: string;
  durationMinutes?: number;
  validatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
  error?: string | null;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export interface LoadingStateProps {
  message?: string;
  size?: number;
}

export interface ErrorStateProps {
  error: Error | { message: string } | string | null;
  title?: string;
  onRetry?: () => void;
}

export interface CaseDisplayProps {
  pageTitle: string;
  pageIcon: React.ReactNode;
  caseData: TransformedCase | null;
  isLoading: boolean;
  error: Error | { message: string } | null;
}

export interface CaseFiltersProps {
  sectors: Sector[];
  initialCasesForOptions: TransformedCase[];
  casesToFilter: TransformedCase[];
  onFiltersApplied: (filteredCases: TransformedCase[]) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

// ============================================================================
// Cache Types
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isStale: boolean;
}

export interface Cache<T> {
  get(key: string): CacheEntry<T> | null;
  set(key: string, data: T): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

// ============================================================================
// Rate Limiting Types
// ============================================================================

export interface RateLimitConfig {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

export interface RateLimiter {
  checkLimit(endpoint: string): RateLimitResult;
  reset(endpoint: string): void;
  resetAll(): void;
  getUsage(endpoint: string): { count: number; resetAt: number };
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResults {
  query: string;
  results: TransformedCase[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = void> = () => Promise<T>;
