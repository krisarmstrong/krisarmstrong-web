import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
  it('should be defined', () => {
    expect(useEscapeKey).toBeDefined();
  });

  it('should call handler when Escape key is pressed', () => {
    const handler = vi.fn();

    renderHook(() => useEscapeKey(handler));

    // Simulate Escape key press
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when other keys are pressed', () => {
    const handler = vi.fn();

    renderHook(() => useEscapeKey(handler));

    // Simulate other key press
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler when isActive is false', () => {
    const handler = vi.fn();

    renderHook(() => useEscapeKey(handler, false));

    // Simulate Escape key press
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should call handler when isActive is true', () => {
    const handler = vi.fn();

    renderHook(() => useEscapeKey(handler, true));

    // Simulate Escape key press
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
