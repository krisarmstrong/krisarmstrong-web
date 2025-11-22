/**
 * @fileoverview Form validation utilities
 * Provides comprehensive validation for user inputs across the application
 * @author Kris Armstrong
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validates phone number format (US and international)
 * @param phone - Phone number to validate
 * @returns Validation result with error message if invalid
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-numeric characters for validation
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }

  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }

  return { isValid: true };
}

/**
 * Validates name field (must be 2-100 characters, letters, spaces, hyphens, apostrophes only)
 * @param name - Name to validate
 * @returns Validation result with error message if invalid
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Name must not exceed 100 characters' };
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
}

/**
 * Validates date of birth (must be 18+ years old)
 * @param dob - Date of birth string (YYYY-MM-DD format)
 * @returns Validation result with error message if invalid
 */
export function validateDateOfBirth(dob: string): ValidationResult {
  if (!dob || dob.trim().length === 0) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const birthDate = new Date(dob);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  // Check if date is in the future
  if (birthDate > today) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, error: 'You must be at least 18 years old' };
  }

  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid date of birth' };
  }

  return { isValid: true };
}

/**
 * Validates street address
 * @param address - Street address to validate
 * @returns Validation result with error message if invalid
 */
export function validateAddress(address: string): ValidationResult {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'Address is required' };
  }

  if (address.trim().length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters' };
  }

  if (address.length > 200) {
    return { isValid: false, error: 'Address must not exceed 200 characters' };
  }

  return { isValid: true };
}

/**
 * Validates city name
 * @param city - City name to validate
 * @returns Validation result with error message if invalid
 */
export function validateCity(city: string): ValidationResult {
  if (!city || city.trim().length === 0) {
    return { isValid: false, error: 'City is required' };
  }

  if (city.trim().length < 2) {
    return { isValid: false, error: 'City must be at least 2 characters' };
  }

  if (city.length > 50) {
    return { isValid: false, error: 'City must not exceed 50 characters' };
  }

  return { isValid: true };
}

/**
 * Validates US state code (2 letters)
 * @param state - State code to validate
 * @returns Validation result with error message if invalid
 */
export function validateState(state: string): ValidationResult {
  if (!state || state.trim().length === 0) {
    return { isValid: false, error: 'State is required' };
  }

  if (state.length !== 2) {
    return { isValid: false, error: 'State must be 2 letters (e.g., CA, NY)' };
  }

  const stateRegex = /^[A-Z]{2}$/;
  if (!stateRegex.test(state.toUpperCase())) {
    return { isValid: false, error: 'Please enter a valid 2-letter state code' };
  }

  return { isValid: true };
}

/**
 * Validates US ZIP code (5 digits or 5+4 format)
 * @param zip - ZIP code to validate
 * @returns Validation result with error message if invalid
 */
export function validateZipCode(zip: string): ValidationResult {
  if (!zip || zip.trim().length === 0) {
    return { isValid: false, error: 'ZIP code is required' };
  }

  // eslint-disable-next-line security/detect-unsafe-regex
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zip)) {
    return { isValid: false, error: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' };
  }

  return { isValid: true };
}

/**
 * Validates PayPal URL is a legitimate PayPal domain
 * @param url - URL to validate
 * @returns Validation result with error message if invalid
 */
export function validatePayPalUrl(url: string): ValidationResult {
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
export function validateFormEndpoint(url: string): ValidationResult {
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

/**
 * Validates message content (for contact forms)
 * @param message - Message to validate
 * @param minLength - Minimum length (default: 10)
 * @param maxLength - Maximum length (default: 5000)
 * @returns Validation result with error message if invalid
 */
export function validateMessage(
  message: string,
  minLength: number = 10,
  maxLength: number = 5000
): ValidationResult {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Message is required' };
  }

  if (message.trim().length < minLength) {
    return { isValid: false, error: `Message must be at least ${minLength} characters` };
  }

  if (message.length > maxLength) {
    return { isValid: false, error: `Message must not exceed ${maxLength} characters` };
  }

  return { isValid: true };
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
