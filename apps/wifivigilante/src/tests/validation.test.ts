import { describe, it, expect } from 'vitest';
import {
  validateSearchQuery,
  validatePublicId,
  validateCaseData,
  sanitizeInput,
} from '../utils/validation';

describe('Validation Utils', () => {
  describe('validateSearchQuery', () => {
    it('should accept valid search queries', () => {
      const result = validateSearchQuery('wifi security');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty queries', () => {
      const result = validateSearchQuery('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject queries that are too long', () => {
      const longQuery = 'a'.repeat(201);
      const result = validateSearchQuery(longQuery);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('should reject XSS attempts', () => {
      const xssAttempts: string[] = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        '<iframe src="evil.com">',
        'onclick=alert(1)',
      ];

      xssAttempts.forEach((attempt) => {
        const result = validateSearchQuery(attempt);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Invalid characters');
      });
    });

    it('should reject non-string inputs', () => {
      const result = validateSearchQuery(123 as unknown as string);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePublicId', () => {
    it('should accept valid UUIDs', () => {
      const result = validatePublicId('550e8400-e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid UUID formats', () => {
      const invalidIds: string[] = [
        'not-a-uuid',
        '123',
        'abc-def-ghi',
        '',
        '550e8400-e29b-41d4-a716', // Too short
      ];

      invalidIds.forEach((id) => {
        const result = validatePublicId(id);
        expect(result.isValid).toBe(false);
      });
    });

    it('should reject non-string inputs', () => {
      const result = validatePublicId(12345 as unknown as string);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCaseData', () => {
    const validCaseData = {
      title: 'Test Case',
      sector_id: 1,
      incident_date: '2024-01-15',
      severity: 'High' as const,
      incident_overview: 'Summary of the incident.',
    };

    it('should accept valid case data', () => {
      const result = validateCaseData(validCaseData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors || {}).length).toBe(0);
    });

    it('should reject missing required fields', () => {
      const result = validateCaseData({});
      expect(result.isValid).toBe(false);
      expect(result.errors?.title).toBeTruthy();
      expect(result.errors?.sector_id).toBeTruthy();
      expect(result.errors?.incident_date).toBeTruthy();
      expect(result.errors?.severity).toBeTruthy();
    });

    it('should reject invalid severity levels', () => {
      const invalidData = { ...validCaseData, severity: 'Unknown' as const };
      const result = validateCaseData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors?.severity).toContain('Invalid severity');
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const invalidData = {
        ...validCaseData,
        incident_date: futureDate.toISOString().split('T')[0],
      };
      const result = validateCaseData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors?.incident_date).toContain('future');
    });

    it('should reject negative duration', () => {
      const invalidData = { ...validCaseData, duration_minutes: -10 };
      const result = validateCaseData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors?.duration_minutes).toBeTruthy();
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeInput('<div>test</div>')).toBe('&lt;div&gt;test&lt;&#x2F;div&gt;');
      expect(sanitizeInput('test"quoted"')).toBe('test&quot;quoted&quot;');
      expect(sanitizeInput("test'quoted'")).toBe('test&#x27;quoted&#x27;');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(123 as unknown as string)).toBe('');
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
    });
  });
});
