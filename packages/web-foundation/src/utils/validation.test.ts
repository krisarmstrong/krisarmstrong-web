/**
 * @fileoverview Tests for validation utilities
 * Comprehensive coverage for all validation functions used across apps
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
  validateMessage,
  sanitizeInput,
  validateRequired,
  validateLength,
  validateUrl,
} from './validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('returns invalid for empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('returns invalid for email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('returns invalid for email without domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('returns invalid for email without TLD', () => {
      const result = validateEmail('test@example');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('returns invalid for email with spaces', () => {
      const result = validateEmail('test @example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('returns valid for correct email format', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns valid for email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for email with plus sign', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for email with dots in local part', () => {
      const result = validateEmail('first.last@example.com');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePhone', () => {
    it('returns invalid for empty string', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validatePhone('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });

    it('returns invalid for phone with less than 10 digits', () => {
      const result = validatePhone('123456789');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be at least 10 digits');
    });

    it('returns invalid for phone with more than 15 digits', () => {
      const result = validatePhone('1234567890123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is too long');
    });

    it('returns valid for 10-digit phone number', () => {
      const result = validatePhone('1234567890');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for formatted US phone', () => {
      const result = validatePhone('(123) 456-7890');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for phone with country code', () => {
      const result = validatePhone('+1 123-456-7890');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for international phone number', () => {
      const result = validatePhone('+44 20 7946 0958');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateName', () => {
    it('returns invalid for empty string', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('returns invalid for single character', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('returns invalid for name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101);
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must not exceed 100 characters');
    });

    it('returns invalid for name with numbers', () => {
      const result = validateName('John123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('returns invalid for name with special characters', () => {
      const result = validateName('John@Doe');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('returns valid for simple name', () => {
      const result = validateName('John');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for name with space', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for hyphenated name', () => {
      const result = validateName('Mary-Jane');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for name with apostrophe', () => {
      const result = validateName("O'Brien");
      expect(result.isValid).toBe(true);
    });

    it('returns valid for name at exactly 100 characters', () => {
      const maxName = 'A'.repeat(100);
      const result = validateName(maxName);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDateOfBirth', () => {
    it('returns invalid for empty string', () => {
      const result = validateDateOfBirth('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date of birth is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateDateOfBirth('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date of birth is required');
    });

    it('returns invalid for invalid date format', () => {
      const result = validateDateOfBirth('not-a-date');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid date');
    });

    it('returns invalid for future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateDateOfBirth(futureDate.toISOString().split('T')[0]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date of birth cannot be in the future');
    });

    it('returns invalid for user under 18', () => {
      const today = new Date();
      const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      const result = validateDateOfBirth(underageDate.toISOString().split('T')[0]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('You must be at least 18 years old');
    });

    it('returns invalid for unreasonably old date (over 120)', () => {
      const result = validateDateOfBirth('1880-01-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid date of birth');
    });

    it('returns valid for user exactly 18 years old', () => {
      const today = new Date();
      const eighteenthBirthday = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      const result = validateDateOfBirth(eighteenthBirthday.toISOString().split('T')[0]);
      expect(result.isValid).toBe(true);
    });

    it('returns valid for user over 18', () => {
      const result = validateDateOfBirth('1990-01-15');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateAddress', () => {
    it('returns invalid for empty string', () => {
      const result = validateAddress('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Address is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateAddress('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Address is required');
    });

    it('returns invalid for address less than 5 characters', () => {
      const result = validateAddress('123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Address must be at least 5 characters');
    });

    it('returns invalid for address exceeding 200 characters', () => {
      const longAddress = 'A'.repeat(201);
      const result = validateAddress(longAddress);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Address must not exceed 200 characters');
    });

    it('returns valid for standard address', () => {
      const result = validateAddress('123 Main Street');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for address with apartment number', () => {
      const result = validateAddress('123 Main Street, Apt 4B');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateCity', () => {
    it('returns invalid for empty string', () => {
      const result = validateCity('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('City is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateCity('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('City is required');
    });

    it('returns invalid for city less than 2 characters', () => {
      const result = validateCity('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('City must be at least 2 characters');
    });

    it('returns invalid for city exceeding 50 characters', () => {
      const longCity = 'A'.repeat(51);
      const result = validateCity(longCity);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('City must not exceed 50 characters');
    });

    it('returns valid for standard city name', () => {
      const result = validateCity('New York');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for city at exactly 50 characters', () => {
      const maxCity = 'A'.repeat(50);
      const result = validateCity(maxCity);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateState', () => {
    it('returns invalid for empty string', () => {
      const result = validateState('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('State is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateState('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('State is required');
    });

    it('returns invalid for single character', () => {
      const result = validateState('C');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('State must be 2 letters (e.g., CA, NY)');
    });

    it('returns invalid for more than 2 characters', () => {
      const result = validateState('CAL');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('State must be 2 letters (e.g., CA, NY)');
    });

    it('returns invalid for numbers', () => {
      const result = validateState('12');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid 2-letter state code');
    });

    it('returns valid for uppercase state code', () => {
      const result = validateState('CA');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for lowercase state code', () => {
      const result = validateState('ny');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for mixed case state code', () => {
      const result = validateState('Tx');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateZipCode', () => {
    it('returns invalid for empty string', () => {
      const result = validateZipCode('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ZIP code is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateZipCode('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ZIP code is required');
    });

    it('returns invalid for less than 5 digits', () => {
      const result = validateZipCode('1234');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
    });

    it('returns invalid for more than 5 digits without hyphen', () => {
      const result = validateZipCode('123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
    });

    it('returns invalid for letters', () => {
      const result = validateZipCode('ABCDE');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
    });

    it('returns invalid for incomplete ZIP+4', () => {
      const result = validateZipCode('12345-67');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
    });

    it('returns valid for 5-digit ZIP', () => {
      const result = validateZipCode('12345');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for ZIP+4 format', () => {
      const result = validateZipCode('12345-6789');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateMessage', () => {
    it('returns invalid for empty string', () => {
      const result = validateMessage('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateMessage('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message is required');
    });

    it('returns invalid for message below default minimum (10)', () => {
      const result = validateMessage('Short');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message must be at least 10 characters');
    });

    it('returns invalid for message exceeding default maximum (5000)', () => {
      const longMessage = 'A'.repeat(5001);
      const result = validateMessage(longMessage);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message must not exceed 5000 characters');
    });

    it('returns valid for message within default range', () => {
      const result = validateMessage('This is a valid message with enough characters.');
      expect(result.isValid).toBe(true);
    });

    it('respects custom minLength', () => {
      const result = validateMessage('Hi', 5, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message must be at least 5 characters');
    });

    it('respects custom maxLength', () => {
      const result = validateMessage('This message is too long', 1, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message must not exceed 10 characters');
    });

    it('returns valid for message at exact minimum', () => {
      const result = validateMessage('1234567890');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for message at exact maximum', () => {
      const result = validateMessage('A'.repeat(5000));
      expect(result.isValid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('returns empty string for non-string input', () => {
      // @ts-expect-error - Testing invalid input
      expect(sanitizeInput(null)).toBe('');
      // @ts-expect-error - Testing invalid input
      expect(sanitizeInput(undefined)).toBe('');
      // @ts-expect-error - Testing invalid input
      expect(sanitizeInput(123)).toBe('');
    });

    it('escapes HTML entities', () => {
      const result = sanitizeInput('<script>alert("XSS")</script>');
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('escapes ampersands', () => {
      const result = sanitizeInput('Tom & Jerry');
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('escapes single quotes', () => {
      const result = sanitizeInput("It's a test");
      expect(result).toBe('It&#x27;s a test');
    });

    it('escapes forward slashes', () => {
      const result = sanitizeInput('path/to/file');
      expect(result).toBe('path&#x2F;to&#x2F;file');
    });

    it('trims whitespace', () => {
      const result = sanitizeInput('  hello world  ');
      expect(result).toBe('hello world');
    });

    it('handles empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('preserves safe characters', () => {
      const result = sanitizeInput('Hello World 123');
      expect(result).toBe('Hello World 123');
    });
  });

  describe('validateRequired', () => {
    it('returns invalid for empty string', () => {
      const result = validateRequired('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateRequired('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('uses custom field name in error message', () => {
      const result = validateRequired('', 'Username');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('returns valid for non-empty string', () => {
      const result = validateRequired('value');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateLength', () => {
    it('returns invalid for string below minimum', () => {
      const result = validateLength('ab', 5, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field must be at least 5 characters');
    });

    it('returns invalid for string above maximum', () => {
      const result = validateLength('abcdefghijk', 1, 5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field must be no more than 5 characters');
    });

    it('uses custom field name in error message', () => {
      const result = validateLength('ab', 5, 10, 'Password');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 5 characters');
    });

    it('returns valid for string at exact minimum', () => {
      const result = validateLength('abcde', 5, 10);
      expect(result.isValid).toBe(true);
    });

    it('returns valid for string at exact maximum', () => {
      const result = validateLength('abcdefghij', 5, 10);
      expect(result.isValid).toBe(true);
    });

    it('returns valid for string within range', () => {
      const result = validateLength('abcdefg', 5, 10);
      expect(result.isValid).toBe(true);
    });

    it('trims whitespace when calculating length', () => {
      const result = validateLength('  abc  ', 5, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field must be at least 5 characters');
    });
  });

  describe('validateUrl', () => {
    it('returns invalid for empty string', () => {
      const result = validateUrl('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL is not configured');
    });

    it('returns invalid for whitespace only', () => {
      const result = validateUrl('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL is not configured');
    });

    it('returns invalid for malformed URL', () => {
      const result = validateUrl('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL format');
    });

    it('returns invalid for non-HTTP protocol', () => {
      const result = validateUrl('ftp://example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL protocol');
    });

    it('uses custom field name in error message', () => {
      const result = validateUrl('', 'API endpoint');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('API endpoint is not configured');
    });

    it('returns valid for HTTP URL', () => {
      const result = validateUrl('http://example.com');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for HTTPS URL', () => {
      const result = validateUrl('https://example.com');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for URL with path', () => {
      const result = validateUrl('https://example.com/path/to/resource');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for URL with query params', () => {
      const result = validateUrl('https://example.com?foo=bar&baz=qux');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for localhost URL', () => {
      const result = validateUrl('http://localhost:3000');
      expect(result.isValid).toBe(true);
    });
  });
});
