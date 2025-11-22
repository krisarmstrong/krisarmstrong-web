/**
 * Validation utilities for form inputs and user data
 */

import type { ValidationResult, CaseFile } from '@/types';

/**
 * Validates a search query string
 * @param query - The search query to validate
 * @returns Validation result with isValid flag and optional error message
 */
export const validateSearchQuery = (query: string): ValidationResult => {
  if (!query) {
    return { isValid: false, error: 'Search query cannot be empty' };
  }

  if (typeof query !== 'string') {
    return { isValid: false, error: 'Search query must be a string' };
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Search query cannot be empty' };
  }

  if (trimmed.length > 200) {
    return { isValid: false, error: 'Search query is too long (max 200 characters)' };
  }

  // Check for potentially malicious patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i, // Event handlers like onclick=
    /<iframe/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Invalid characters in search query' };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Validates a case public ID
 * @param publicId - The public ID to validate
 * @returns Validation result with isValid flag and optional error message
 */
export const validatePublicId = (publicId: string): ValidationResult => {
  if (!publicId) {
    return { isValid: false, error: 'Case ID is required' };
  }

  if (typeof publicId !== 'string') {
    return { isValid: false, error: 'Case ID must be a string' };
  }

  const trimmed = publicId.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Case ID cannot be empty' };
  }

  // UUID format validation (adjust if your IDs have a different format)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(trimmed)) {
    return { isValid: false, error: 'Invalid Case ID format' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates case form data
 * @param caseData - The case data to validate
 * @returns Validation result with isValid flag and errors object
 */
export const validateCaseData = (caseData: Partial<CaseFile>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Required fields
  if (!caseData.title || caseData.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (caseData.title.length > 200) {
    errors.title = 'Title is too long (max 200 characters)';
  }

  if (!caseData.sector_id) {
    errors.sector_id = 'Sector is required';
  }

  if (!caseData.incident_date) {
    errors.incident_date = 'Incident date is required';
  } else {
    const date = new Date(caseData.incident_date);
    if (isNaN(date.getTime())) {
      errors.incident_date = 'Invalid date format';
    } else {
      // Compare dates at midnight to avoid timezone edge cases
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (date > today) {
        errors.incident_date = 'Incident date cannot be in the future';
      }
    }
  }

  if (!caseData.severity) {
    errors.severity = 'Severity is required';
  } else if (!['Critical', 'High', 'Medium', 'Low'].includes(caseData.severity)) {
    errors.severity = 'Invalid severity level';
  }

  // Incident overview is required
  if (!caseData.incident_overview || caseData.incident_overview.trim().length === 0) {
    errors.incident_overview = 'Incident overview is required';
  } else if (caseData.incident_overview.length > 5000) {
    errors.incident_overview = 'Incident overview is too long (max 5000 characters)';
  }

  if (caseData.duration_minutes && (isNaN(caseData.duration_minutes) || caseData.duration_minutes < 0)) {
    errors.duration_minutes = 'Duration must be a positive number';
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    isValid: !hasErrors,
    errors: hasErrors ? errors : {},
  };
};

/**
 * Sanitizes user input to prevent XSS
 * @param input - The input to sanitize
 * @returns Sanitized input string
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
