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
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    if (isLocked) {
      // Prevent scrollbar from causing layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}
