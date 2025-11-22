/**
 * @fileoverview Form validation utilities
 * Re-exports shared validators and provides app-specific validation
 * @author Kris Armstrong
 */

// Re-export shared validation utilities from web-foundation
export type { ValidationResult } from '@krisarmstrong/web-foundation';
export {
  validateEmail,
  validatePhone,
  validateName,
  validateDateOfBirth,
  validateAddress,
  validateCity,
  validateState,
  validateZipCode,
  validateMessage,
  sanitizeInput,
  validateRequired,
  validateLength,
  validateUrl,
} from '@krisarmstrong/web-foundation';

// App-specific validation functions

/**
 * Validates PayPal URL is a legitimate PayPal domain
 * @param url - URL to validate
 * @returns Validation result with error message if invalid
 */
export function validatePayPalUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim().length === 0) {
    return { isValid: false, error: 'Payment URL is not configured' };
  }

  try {
    const parsedUrl = new URL(url);
    const validPayPalDomains = ['paypal.com', 'www.paypal.com'];

    if (!validPayPalDomains.some((domain) => parsedUrl.hostname.endsWith(domain))) {
      return { isValid: false, error: 'Invalid payment URL. Please contact support.' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid payment URL format' };
  }
}

/**
 * Validates form endpoint URL
 * @param url - URL to validate
 * @returns Validation result with error message if invalid
 */
export function validateFormEndpoint(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim().length === 0) {
    return { isValid: false, error: 'Form endpoint is not configured' };
  }

  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.protocol.startsWith('http')) {
      return { isValid: false, error: 'Invalid form endpoint protocol' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid form endpoint format' };
  }
}
