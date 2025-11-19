import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('should be defined', () => {
    expect(useClickOutside).toBeDefined();
  });

  it('should call handler when clicking outside element', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useClickOutside(ref, handler));

    // Simulate click outside
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(outsideElement);
  });

  it('should not call handler when clicking inside element', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useClickOutside(ref, handler));

    // Simulate click inside
    const event = new MouseEvent('mousedown', { bubbles: true });
    ref.current?.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});
