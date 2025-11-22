// src/constants/index.ts

// Time durations (in milliseconds)
export const DURATION = {
  CACHE_24H: 24 * 60 * 60 * 1000,
  CACHE_1H: 60 * 60 * 1000,
  DEBOUNCE_DEFAULT: 300,
  FOCUS_DELAY: 100,
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
} as const;

// UI measurements
export const SIZE = {
  ICON: {
    XS: 16,
    SM: 20,
    MD: 24,
    LG: 32,
    XL: 48,
  },
  AVATAR: {
    SM: 32,
    MD: 40,
    LG: 56,
  },
  CONTAINER: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
} as const;

// Z-index layers
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  OVERLAY: 30,
  MODAL: 40,
  POPOVER: 50,
  TOOLTIP: 60,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// API
export const API = {
  TIMEOUT: 30000,  // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,  // 1 second
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TITLE_LENGTH: 200,
  MAX_TAG_LENGTH: 50,
  MAX_TAGS: 10,
} as const;
