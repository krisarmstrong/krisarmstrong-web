import { useEffect } from 'react';

/**
 * Hook that calls handler when Escape key is pressed
 *
 * @param handler - Function to call when Escape is pressed
 * @param isActive - Optional boolean to enable/disable the hook (default: true)
 *
 * @example
 * ```tsx
 * useEscapeKey(() => setIsOpen(false), isOpen);
 * ```
 */
export function useEscapeKey(handler: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler, isActive]);
}
