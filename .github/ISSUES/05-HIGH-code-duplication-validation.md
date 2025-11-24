---
title: '🟠 HIGH: Move duplicate validation utilities to web-foundation (saves ~400 lines)'
labels: code-duplication, high-priority, refactor, web-foundation
assignees: krisarmstrong
---

**Status: CLOSED (2025-11-24) — Shared validation utilities now live in `packages/web-foundation/src/utils/validation.ts`; app-specific duplicates removed.**

## Priority: HIGH 🟠

**Impact:** ~400 lines of duplicated validation code across apps

## Current State

Validation utilities are duplicated in two apps:

- `apps/intrinsic/src/utils/validation.ts` (292 lines)
- `apps/wifivigilante/src/utils/validation.ts` (154 lines)

## Duplicated Functions

### Generic validators (should be shared):

- `validateEmail()`
- `validatePhone()`
- `validateName()`
- `validateAddress()`
- `validateCity()`
- `validateState()`
- `validateZipCode()`
- `sanitizeInput()`

### App-specific (keep in apps):

- `validateServiceSelection()` (intrinsic only)
- `validateCaseData()` (wifivigilante only)

## Implementation

### Step 1: Create shared validation module

Create `packages/web-foundation/src/utils/validation.ts`:

```typescript
/**
 * Shared validation utilities for forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email address format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validates phone number format (US)
 */
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digits = phone.replace(/\D/g, '');

  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Phone number contains invalid characters' };
  }

  if (digits.length !== 10) {
    return { isValid: false, error: 'Phone number must be 10 digits' };
  }

  return { isValid: true };
}

/**
 * Validates name (first or last)
 */
export function validateName(name: string, fieldName = 'Name'): ValidationResult {
  const nameRegex = /^[a-zA-Z\s\-']+$/;

  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }

  return { isValid: true };
}

/**
 * Validates street address
 */
export function validateAddress(address: string): ValidationResult {
  if (!address.trim()) {
    return { isValid: false, error: 'Address is required' };
  }

  if (address.length < 5) {
    return { isValid: false, error: 'Please enter a complete address' };
  }

  return { isValid: true };
}

/**
 * Validates city name
 */
export function validateCity(city: string): ValidationResult {
  const cityRegex = /^[a-zA-Z\s\-']+$/;

  if (!city.trim()) {
    return { isValid: false, error: 'City is required' };
  }

  if (!cityRegex.test(city)) {
    return { isValid: false, error: 'City contains invalid characters' };
  }

  return { isValid: true };
}

/**
 * Validates US state code
 */
export function validateState(state: string): ValidationResult {
  const validStates = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  const upperState = state.toUpperCase().trim();

  if (!upperState) {
    return { isValid: false, error: 'State is required' };
  }

  if (!validStates.includes(upperState)) {
    return { isValid: false, error: 'Please enter a valid US state code' };
  }

  return { isValid: true };
}

/**
 * Validates ZIP code (US)
 */
export function validateZipCode(zip: string): ValidationResult {
  const zipRegex = /^\d{5}(-\d{4})?$/;

  if (!zip.trim()) {
    return { isValid: false, error: 'ZIP code is required' };
  }

  if (!zipRegex.test(zip)) {
    return { isValid: false, error: 'Please enter a valid ZIP code (12345 or 12345-6789)' };
  }

  return { isValid: true };
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates required field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

/**
 * Validates string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const length = value.trim().length;

  if (length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }

  if (length > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max} characters` };
  }

  return { isValid: true };
}
```

### Step 2: Export from web-foundation

Update `packages/web-foundation/src/index.ts`:

```typescript
// ... existing exports
export * from './utils/validation';
```

### Step 3: Update Intrinsic

Replace `apps/intrinsic/src/utils/validation.ts` with:

```typescript
// Re-export shared validators
export {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
  validateCity,
  validateState,
  validateZipCode,
  sanitizeInput,
  validateRequired,
  validateLength,
  type ValidationResult,
} from '@krisarmstrong/web-foundation';

// App-specific validators
export function validateServiceSelection(service: string): ValidationResult {
  // ... intrinsic-specific code
}
```

### Step 4: Update WiFiVigilante

Replace `apps/wifivigilante/src/utils/validation.ts` with:

```typescript
// Re-export shared validators
export {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
  validateCity,
  validateState,
  validateZipCode,
  sanitizeInput,
  validateRequired,
  validateLength,
  type ValidationResult,
} from '@krisarmstrong/web-foundation';

// App-specific validators
export function validateCaseData(caseData: any): ValidationResult {
  // ... wifivigilante-specific code
}
```

### Step 5: Build and test

```bash
cd packages/web-foundation
npm run build

cd ../../apps/intrinsic
npm test

cd ../wifivigilante
npm test
```

## Testing Checklist

- [ ] Shared validation module created
- [ ] Exported from web-foundation
- [ ] Intrinsic uses shared validators
- [ ] WiFiVigilante uses shared validators
- [ ] All existing tests pass
- [ ] Forms still work in all apps
- [ ] Type checking passes

## Files to Modify

- **Create:** `packages/web-foundation/src/utils/validation.ts`
- **Update:** `packages/web-foundation/src/index.ts`
- **Update:** `apps/intrinsic/src/utils/validation.ts` (reduce to re-exports + app-specific)
- **Update:** `apps/wifivigilante/src/utils/validation.ts` (reduce to re-exports + app-specific)

## Success Criteria

- [ ] ~400 lines of code removed
- [ ] Single source of truth for validation
- [ ] All apps use same validation logic
- [ ] Easy to add new validators
- [ ] No functionality regression

## Benefits

- Code reduction: ~400 lines → ~50 lines + shared module
- Consistency: Same validation across all apps
- Maintainability: Fix bugs in one place
- Testability: Shared tests for validators
