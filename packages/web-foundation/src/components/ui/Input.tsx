import type { ChangeEvent, InputHTMLAttributes } from 'react';

// ============================================================================
// Text Input
// ============================================================================

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Input value */
  value: string;
  /** Change handler */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Optional label text */
  label?: string;
  /** Optional error message */
  error?: string;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
}

const focusRingColors = {
  violet: 'focus:ring-violet-500',
  blue: 'focus:ring-blue-500',
  green: 'focus:ring-green-500',
  red: 'focus:ring-red-500',
  yellow: 'focus:ring-yellow-500',
  gray: 'focus:ring-gray-500',
};

/**
 * TextInput - Standard text input component
 */
export function TextInput({
  value,
  onChange,
  label,
  error,
  variant = 'blue',
  className = '',
  id,
  ...props
}: TextInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        className={`
          w-full bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'}
          text-gray-200 px-4 py-3 rounded-md shadow-sm
          focus:outline-none focus:ring-2 ${focusRingColors[variant]}
          placeholder-gray-400 text-base
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

// ============================================================================
// Search Input
// ============================================================================

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Search value */
  value: string;
  /** Change handler */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Optional label text */
  label?: string;
  /** Color variant */
  variant?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'gray';
}

/**
 * SearchInput - Search-specific input component
 */
export function SearchInput({
  value,
  onChange,
  label,
  variant = 'blue',
  className = '',
  id,
  placeholder = 'Search...',
  ...props
}: SearchInputProps) {
  const inputId = id || 'search-input';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full bg-gray-700 border border-gray-600
          text-gray-200 px-4 py-3 rounded-md shadow-sm
          focus:outline-none focus:ring-2 ${focusRingColors[variant]}
          placeholder-gray-400 text-base
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
