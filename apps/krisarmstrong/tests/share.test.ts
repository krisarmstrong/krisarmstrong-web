import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shareToPlatform, type SharePlatform } from '../src/lib/share';

describe('shareToPlatform', () => {
  const mockPost = {
    title: 'Introduction to Wi-Fi 7',
    slug: 'wifi7-intro',
  };

  const mockUrl = 'https://krisarmstrong.org/blog/wifi7-intro';
  let mockWindowOpen: ReturnType<typeof vi.fn>;
  let mockLogger: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockWindowOpen = vi.fn();
    mockLogger = vi.fn();
    vi.stubGlobal('window', {
      open: mockWindowOpen,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens LinkedIn share URL in new window', () => {
    shareToPlatform('linkedin', mockPost, mockUrl, mockLogger);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing/share-offsite'),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(mockUrl)),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockLogger).toHaveBeenCalledWith('Shared wifi7-intro to linkedin');
  });

  it('opens Twitter share URL with text in new window', () => {
    shareToPlatform('twitter', mockPost, mockUrl, mockLogger);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(mockPost.title)),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(mockUrl)),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockLogger).toHaveBeenCalledWith('Shared wifi7-intro to twitter');
  });

  it('opens Facebook share URL in new window', () => {
    shareToPlatform('facebook', mockPost, mockUrl, mockLogger);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer/sharer.php'),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(mockUrl)),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockLogger).toHaveBeenCalledWith('Shared wifi7-intro to facebook');
  });

  it('handles unknown platform gracefully by returning early', () => {
    shareToPlatform('unknown' as SharePlatform, mockPost, mockUrl, mockLogger);

    expect(mockWindowOpen).not.toHaveBeenCalled();
    expect(mockLogger).not.toHaveBeenCalled();
  });

  it('uses default logger when none provided', () => {
    // Should not throw when no logger provided
    expect(() => shareToPlatform('linkedin', mockPost, mockUrl)).not.toThrow();

    expect(mockWindowOpen).toHaveBeenCalled();
  });

  it('properly encodes special characters in post title', () => {
    const postWithSpecialChars = {
      title: "Wi-Fi 7 & 802.11be: What's Next?",
      slug: 'wifi7-special',
    };

    shareToPlatform('twitter', postWithSpecialChars, mockUrl, mockLogger);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(postWithSpecialChars.title)),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('properly encodes URLs with query parameters', () => {
    const urlWithParams = 'https://krisarmstrong.org/blog/test?utm_source=share&utm_medium=social';

    shareToPlatform('linkedin', mockPost, urlWithParams, mockLogger);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(urlWithParams)),
      '_blank',
      'noopener,noreferrer'
    );
  });
});
