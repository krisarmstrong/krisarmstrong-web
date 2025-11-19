import { useEffect } from 'react';

/**
 * Hook that locks body scroll when active (useful for modals/drawers)
 *
 * @param isLocked - Whether scroll should be locked
 *
 * @example
 * ```tsx
 * useBodyScrollLock(isModalOpen);
 * ```
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const body = document.body;
    const originalOverflow = body.style.overflow;
    const originalPaddingRight = body.style.paddingRight;

    if (isLocked) {
      // Prevent scrollbar from causing layout shift
      const scrollbarWidth =
        typeof window !== 'undefined'
          ? window.innerWidth - document.documentElement.clientWidth
          : 0;

      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      body.style.overflow = originalOverflow;
      body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}
