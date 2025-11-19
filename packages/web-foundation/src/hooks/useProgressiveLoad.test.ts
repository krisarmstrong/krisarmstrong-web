import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgressiveLoad } from './useProgressiveLoad';

describe('useProgressiveLoad', () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  it('should be defined', () => {
    expect(useProgressiveLoad).toBeDefined();
  });

  it('should return initial visible items', () => {
    const { result } = renderHook(() => useProgressiveLoad(mockItems, { initialCount: 5 }));

    expect(result.current.visibleItems).toHaveLength(5);
    expect(result.current.visibleItems[0]).toEqual({ id: 0, name: 'Item 0' });
    expect(result.current.remainingCount).toBe(20);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.displayCount).toBe(5);
  });

  it('should load more items when loadMore is called', () => {
    const { result } = renderHook(() =>
      useProgressiveLoad(mockItems, { itemsPerLoad: 5, initialCount: 5 })
    );

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.visibleItems).toHaveLength(10);
    expect(result.current.remainingCount).toBe(15);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.displayCount).toBe(10);
  });

  it('should not have more items when all are loaded', () => {
    const { result } = renderHook(() =>
      useProgressiveLoad(mockItems, { itemsPerLoad: 25, initialCount: 25 })
    );

    expect(result.current.visibleItems).toHaveLength(25);
    expect(result.current.remainingCount).toBe(0);
    expect(result.current.hasMore).toBe(false);
  });

  it('should reset to initial count', () => {
    const { result } = renderHook(() =>
      useProgressiveLoad(mockItems, { itemsPerLoad: 5, initialCount: 5 })
    );

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.displayCount).toBe(10);

    act(() => {
      result.current.reset();
    });

    expect(result.current.displayCount).toBe(5);
    expect(result.current.visibleItems).toHaveLength(5);
  });

  it('should reset when items array changes', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useProgressiveLoad(items, { itemsPerLoad: 5, initialCount: 5 }),
      { initialProps: { items: mockItems } }
    );

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.displayCount).toBe(10);

    // Change items array
    const newItems = mockItems.slice(0, 10);
    rerender({ items: newItems });

    expect(result.current.displayCount).toBe(5);
    expect(result.current.visibleItems).toHaveLength(5);
  });

  it('should use default options', () => {
    const { result } = renderHook(() => useProgressiveLoad(mockItems));

    expect(result.current.visibleItems).toHaveLength(12); // default initialCount = itemsPerLoad = 12
    expect(result.current.displayCount).toBe(12);
  });
});
