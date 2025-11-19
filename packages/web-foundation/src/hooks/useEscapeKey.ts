import { useEffect, useRef } from 'react';

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
  // Store handler in ref to avoid re-running effect when handler changes
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!isActive || typeof document === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handlerRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]); // Only re-run if isActive changes
}
