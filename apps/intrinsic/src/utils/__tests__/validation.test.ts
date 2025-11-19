/**
 * @fileoverview Tests for validation utility functions
 * @author Kris Armstrong
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validateName,
  validateDateOfBirth,
  validateAddress,
  validateCity,
  validateState,
  validateZipCode,
  validatePayPalUrl,
  validateFormEndpoint,
  validateMessage,
  sanitizeInput,
} from '../validation';

describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('test@example.com')).toEqual({ isValid: true });
    expect(validateEmail('user.name+tag@example.co.uk')).toEqual({ isValid: true });
    expect(validateEmail('test.email@subdomain.example.com')).toEqual({ isValid: true });
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('')).toEqual({ isValid: false, error: 'Email is required' });
    expect(validateEmail('invalid')).toEqual({ isValid: false, error: 'Please enter a valid email address' });
    expect(validateEmail('invalid@')).toEqual({ isValid: false, error: 'Please enter a valid email address' });
    expect(validateEmail('@example.com')).toEqual({ isValid: false, error: 'Please enter a valid email address' });
  });
});

describe('validatePhone', () => {
  it('should accept valid phone numbers', () => {
    expect(validatePhone('1234567890')).toEqual({ isValid: true });
    expect(validatePhone('(555) 123-4567')).toEqual({ isValid: true });
    expect(validatePhone('+1-555-123-4567')).toEqual({ isValid: true });
    expect(validatePhone('555.123.4567')).toEqual({ isValid: true });
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhone('')).toEqual({ isValid: false, error: 'Phone number is required' });
    expect(validatePhone('123')).toEqual({ isValid: false, error: 'Phone number must be at least 10 digits' });
    expect(validatePhone('12345678901234567890')).toEqual({ isValid: false, error: 'Phone number is too long' });
  });
});

describe('validateName', () => {
  it('should accept valid names', () => {
    expect(validateName('John Doe')).toEqual({ isValid: true });
    expect(validateName("Mary O'Brien")).toEqual({ isValid: true });
    expect(validateName('Jean-Claude')).toEqual({ isValid: true });
  });

  it('should reject invalid names', () => {
    expect(validateName('')).toEqual({ isValid: false, error: 'Name is required' });
    expect(validateName('A')).toEqual({ isValid: false, error: 'Name must be at least 2 characters' });
    expect(validateName('A'.repeat(101))).toEqual({ isValid: false, error: 'Name must not exceed 100 characters' });
    expect(validateName('John123')).toEqual({ isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' });
  });
});

describe('validateDateOfBirth', () => {
  it('should accept valid dates for 18+ year olds', () => {
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 25); // 25 years ago
    expect(validateDateOfBirth(validDate.toISOString().split('T')[0])).toEqual({ isValid: true });
  });

  it('should reject dates for under 18', () => {
    const underAge = new Date();
    underAge.setFullYear(underAge.getFullYear() - 17); // 17 years ago
    const result = validateDateOfBirth(underAge.toISOString().split('T')[0]);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('You must be at least 18 years old');
  });

  it('should reject future dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const result = validateDateOfBirth(futureDate.toISOString().split('T')[0]);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Date of birth cannot be in the future');
  });

  it('should reject empty dates', () => {
    expect(validateDateOfBirth('')).toEqual({ isValid: false, error: 'Date of birth is required' });
  });
});

describe('validateAddress', () => {
  it('should accept valid addresses', () => {
    expect(validateAddress('123 Main Street')).toEqual({ isValid: true });
    expect(validateAddress('1234 Oak Ave, Apt 5B')).toEqual({ isValid: true });
  });

  it('should reject invalid addresses', () => {
    expect(validateAddress('')).toEqual({ isValid: false, error: 'Address is required' });
    expect(validateAddress('123')).toEqual({ isValid: false, error: 'Address must be at least 5 characters' });
    expect(validateAddress('A'.repeat(201))).toEqual({ isValid: false, error: 'Address must not exceed 200 characters' });
  });
});

describe('validateCity', () => {
  it('should accept valid city names', () => {
    expect(validateCity('New York')).toEqual({ isValid: true });
    expect(validateCity('Los Angeles')).toEqual({ isValid: true });
  });

  it('should reject invalid city names', () => {
    expect(validateCity('')).toEqual({ isValid: false, error: 'City is required' });
    expect(validateCity('A')).toEqual({ isValid: false, error: 'City must be at least 2 characters' });
    expect(validateCity('A'.repeat(51))).toEqual({ isValid: false, error: 'City must not exceed 50 characters' });
  });
});

describe('validateState', () => {
  it('should accept valid state codes', () => {
    expect(validateState('CA')).toEqual({ isValid: true });
    expect(validateState('NY')).toEqual({ isValid: true });
  });

  it('should reject invalid state codes', () => {
    expect(validateState('')).toEqual({ isValid: false, error: 'State is required' });
    expect(validateState('C')).toEqual({ isValid: false, error: 'State must be 2 letters (e.g., CA, NY)' });
    expect(validateState('CAL')).toEqual({ isValid: false, error: 'State must be 2 letters (e.g., CA, NY)' });
    expect(validateState('C1')).toEqual({ isValid: false, error: 'Please enter a valid 2-letter state code' });
  });
});

describe('validateZipCode', () => {
  it('should accept valid ZIP codes', () => {
    expect(validateZipCode('12345')).toEqual({ isValid: true });
    expect(validateZipCode('12345-6789')).toEqual({ isValid: true });
  });

  it('should reject invalid ZIP codes', () => {
    expect(validateZipCode('')).toEqual({ isValid: false, error: 'ZIP code is required' });
    expect(validateZipCode('1234')).toEqual({ isValid: false, error: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' });
    expect(validateZipCode('ABCDE')).toEqual({ isValid: false, error: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' });
  });
});

describe('validatePayPalUrl', () => {
  it('should accept valid PayPal URLs', () => {
    expect(validatePayPalUrl('https://www.paypal.com/paypalme/test')).toEqual({ isValid: true });
    expect(validatePayPalUrl('https://paypal.com/checkout/123')).toEqual({ isValid: true });
  });

  it('should reject invalid PayPal URLs', () => {
    expect(validatePayPalUrl('')).toEqual({ isValid: false, error: 'Payment URL is not configured' });
    expect(validatePayPalUrl('https://malicious.com/fake')).toEqual({ isValid: false, error: 'Invalid payment URL. Please contact support.' });
    expect(validatePayPalUrl('not-a-url')).toEqual({ isValid: false, error: 'Invalid payment URL format' });
  });
});

describe('validateFormEndpoint', () => {
  it('should accept valid HTTP(S) URLs', () => {
    expect(validateFormEndpoint('https://formspree.io/f/abc123')).toEqual({ isValid: true });
    expect(validateFormEndpoint('http://localhost:3000/api/form')).toEqual({ isValid: true });
  });

  it('should reject invalid endpoints', () => {
    expect(validateFormEndpoint('')).toEqual({ isValid: false, error: 'Form endpoint is not configured' });
    expect(validateFormEndpoint('ftp://invalid.com')).toEqual({ isValid: false, error: 'Invalid form endpoint protocol' });
    expect(validateFormEndpoint('not-a-url')).toEqual({ isValid: false, error: 'Invalid form endpoint format' });
  });
});

describe('validateMessage', () => {
  it('should accept valid messages', () => {
    expect(validateMessage('This is a valid message with enough characters.')).toEqual({ isValid: true });
  });

  it('should reject invalid messages', () => {
    expect(validateMessage('')).toEqual({ isValid: false, error: 'Message is required' });
    expect(validateMessage('Short')).toEqual({ isValid: false, error: 'Message must be at least 10 characters' });
    expect(validateMessage('A'.repeat(5001))).toEqual({ isValid: false, error: 'Message must not exceed 5000 characters' });
  });

  it('should respect custom length parameters', () => {
    expect(validateMessage('Hello', 5, 100)).toEqual({ isValid: true });
    expect(validateMessage('Hi', 5, 100)).toEqual({ isValid: false, error: 'Message must be at least 5 characters' });
  });
});

describe('sanitizeInput', () => {
  it('should escape HTML special characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(sanitizeInput('Test & Demo')).toBe('Test &amp; Demo');
    expect(sanitizeInput("It's a test")).toBe('It&#039;s a test');
  });

  it('should handle empty strings', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('should handle normal text unchanged', () => {
    expect(sanitizeInput('Normal text')).toBe('Normal text');
  });
});
