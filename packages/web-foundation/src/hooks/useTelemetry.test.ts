import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTelemetry } from './useTelemetry';
import type { TelemetryProvider, TelemetryConfig } from './useTelemetry';

describe('useTelemetry', () => {
  let plausibleMock: ReturnType<typeof vi.fn>;
  let gtagMock: ReturnType<typeof vi.fn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset window objects
    delete (window as any).plausible;
    delete (window as any).gtag;
    delete (window as any).GA_MEASUREMENT_ID;

    // Setup spies
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/test-path',
        href: 'http://localhost/test-path',
      },
      writable: true,
      configurable: true,
    });

    // Mock document properties
    Object.defineProperty(document, 'title', {
      value: 'Test Page',
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document, 'referrer', {
      value: 'http://example.com',
      writable: true,
      configurable: true,
    });

    // Suppress error logging during tests to prevent unhandled error warnings
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Provider Detection', () => {
    it('should detect Plausible provider', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, debug: true })
      );

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry] Using Plausible Analytics provider'
        );
      });

      result.current.trackEvent('test_event');

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('test_event', { props: {} });
      });
    });

    it('should detect Google Analytics provider', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, debug: true })
      );

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry] Using Google Analytics provider'
        );
      });

      result.current.trackEvent('test_event');

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'test_event', {});
      });
    });

    it('should prioritize Google Analytics over Plausible', async () => {
      gtagMock = vi.fn();
      plausibleMock = vi.fn();
      (window as any).gtag = gtagMock;
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, debug: true })
      );

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry] Using Google Analytics provider'
        );
      });

      result.current.trackEvent('test_event');

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalled();
        expect(plausibleMock).not.toHaveBeenCalled();
      });
    });

    it('should use custom provider when provided', async () => {
      const customProvider: TelemetryProvider = {
        trackEvent: vi.fn(),
        trackError: vi.fn(),
        trackPageView: vi.fn(),
        identify: vi.fn(),
      };

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, provider: customProvider, debug: true })
      );

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry] Using custom provider'
        );
      });

      result.current.trackEvent('test_event', { foo: 'bar' });

      expect(customProvider.trackEvent).toHaveBeenCalledWith('test_event', {
        foo: 'bar',
      });
    });

    it('should retry provider detection with configured intervals', async () => {
      vi.useFakeTimers();

      renderHook(() =>
        useTelemetry({
          enabled: true,
          maxProviderRetries: 3,
          providerRetryInterval: 100,
          debug: true,
        })
      );

      // No provider initially
      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Using')
      );

      // Add provider after 250ms (2.5 retries)
      vi.advanceTimersByTime(250);
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      // Advance to next retry
      await vi.advanceTimersByTimeAsync(100);

      // Check that provider was detected
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Telemetry] Using Plausible Analytics provider'
      );

      vi.useRealTimers();
    });

    it('should fallback to console provider in debug mode after max retries', async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() =>
        useTelemetry({
          enabled: true,
          maxProviderRetries: 2,
          providerRetryInterval: 100,
          debug: true,
        })
      );

      // Advance through all retries without adding a provider
      await vi.advanceTimersByTimeAsync(300);

      // Check that console provider fallback message appeared
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Telemetry] No provider detected after 2 retries, using console provider (debug mode)'
      );

      // Test that console provider works - trackEvent
      result.current.trackEvent('test_event', { foo: 'bar' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Telemetry Event]',
        'test_event',
        { foo: 'bar' }
      );

      // Test console provider - trackError
      const testError = new Error('Console test error');
      result.current.trackError(testError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Telemetry Error]',
        testError
      );

      // Test console provider - trackPageView
      result.current.trackPageView({ path: '/console-test' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Telemetry Page View]',
        expect.objectContaining({ path: '/console-test' })
      );

      // Test console provider - identify
      result.current.identify('user456', { role: 'admin' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Telemetry Identify]',
        'user456',
        { role: 'admin' }
      );

      vi.useRealTimers();
    });

    it('should handle no provider gracefully when debug is false', async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() =>
        useTelemetry({
          enabled: true,
          maxProviderRetries: 1,
          providerRetryInterval: 100,
          debug: false,
        })
      );

      vi.advanceTimersByTime(200);

      // Should not throw errors
      result.current.trackEvent('test_event');
      result.current.trackError(new Error('test error'));
      result.current.trackPageView();
      result.current.identify('user123');

      // No errors should be thrown
      expect(true).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('Event Tracking', () => {
    it('should track events with Plausible', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackEvent('button_click', { button: 'submit' });
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('button_click', {
          props: { button: 'submit' },
        });
      });
    });

    it('should track events with Google Analytics', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackEvent('button_click', { button: 'submit' });
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'button_click', {
          button: 'submit',
        });
      });
    });

    it('should merge default properties with event properties', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() =>
        useTelemetry({
          enabled: true,
          defaultProperties: { app: 'test-app', version: '1.0.0' },
        })
      );

      await waitFor(() => {
        result.current.trackEvent('button_click', { button: 'submit' });
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('button_click', {
          props: {
            app: 'test-app',
            version: '1.0.0',
            button: 'submit',
          },
        });
      });
    });

    it('should log events in debug mode', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, debug: true })
      );

      await waitFor(() => {
        result.current.trackEvent('test_event', { foo: 'bar' });
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry trackEvent]',
          'test_event',
          { foo: 'bar' }
        );
      });
    });

    it('should not track events when disabled', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: false }));

      result.current.trackEvent('test_event');

      expect(plausibleMock).not.toHaveBeenCalled();
    });

    it('should handle event properties with various types', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackEvent('complex_event', {
          string: 'value',
          number: 42,
          boolean: true,
          nullValue: null,
          undefinedValue: undefined,
        });
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('complex_event', {
          props: {
            string: 'value',
            number: 42,
            boolean: true,
            nullValue: null,
            undefinedValue: undefined,
          },
        });
      });
    });
  });

  describe('Error Tracking', () => {
    it('should track Error objects with Plausible', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      const error = new Error('Test error');

      await waitFor(() => {
        result.current.trackError(error);
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('Error', {
          props: { error: 'Test error' },
        });
      });
    });

    it('should track Error objects with Google Analytics', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      const error = new Error('Test error');

      await waitFor(() => {
        result.current.trackError(error);
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'exception', {
          description: 'Test error',
          fatal: false,
        });
      });
    });

    it('should track error context objects', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      const errorContext = {
        message: 'Custom error',
        stack: 'Error stack trace',
        componentStack: 'React component stack',
      };

      await waitFor(() => {
        result.current.trackError(errorContext);
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('Error', {
          props: { error: 'Custom error' },
        });
      });
    });

    it('should log errors in debug mode', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, debug: true })
      );

      const error = new Error('Test error');

      await waitFor(() => {
        result.current.trackError(error);
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry trackError]',
          error
        );
      });
    });

    it('should not track errors when disabled', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: false }));

      result.current.trackError(new Error('Test error'));

      expect(plausibleMock).not.toHaveBeenCalled();
    });

    it('should automatically track window errors when trackErrors is true', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      // Add error handler to catch test errors and prevent them from being reported
      const errorHandler = (event: Event) => {
        event.preventDefault();
      };
      window.addEventListener('error', errorHandler, true);

      renderHook(() => useTelemetry({ enabled: true, trackErrors: true }));

      await waitFor(() => {
        expect(plausibleMock).toBeDefined();
      });

      // Create a mock error object without using Error constructor
      const mockError = {
        message: 'Uncaught error',
        name: 'Error',
        stack: 'Error: Uncaught error\n    at test',
      };

      // Simulate a window error
      const errorEvent = new ErrorEvent('error', {
        message: 'Uncaught error',
        error: mockError,
      });
      window.dispatchEvent(errorEvent);

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('Error', {
          props: { error: 'Uncaught error' },
        });
      });

      // Cleanup
      window.removeEventListener('error', errorHandler, true);
    });

    it('should automatically track unhandled promise rejections when trackErrors is true', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      renderHook(() => useTelemetry({ enabled: true, trackErrors: true }));

      await waitFor(() => {
        expect(plausibleMock).toBeDefined();
      });

      // Simulate an unhandled promise rejection (preventDefault to avoid unhandled error)
      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.resolve(), // Use resolved promise to avoid actual rejection
        reason: 'Promise rejection',
        cancelable: true,
      });
      rejectionEvent.preventDefault();
      window.dispatchEvent(rejectionEvent);

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('Error', {
          props: { error: 'Unhandled Promise Rejection: Promise rejection' },
        });
      });
    });

    it('should not track automatic errors when trackErrors is false', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      // Add error handler to catch test errors and prevent them from being reported
      const errorHandler = (event: Event) => {
        event.preventDefault();
      };
      window.addEventListener('error', errorHandler, true);

      renderHook(() => useTelemetry({ enabled: true, trackErrors: false }));

      await waitFor(() => {
        expect(plausibleMock).toBeDefined();
      });

      // Clear previous calls
      plausibleMock.mockClear();

      // Create a mock error object without using Error constructor
      const mockError = {
        message: 'Uncaught error',
        name: 'Error',
        stack: 'Error: Uncaught error\n    at test',
      };

      // Simulate a window error
      const errorEvent = new ErrorEvent('error', {
        message: 'Uncaught error',
        error: mockError,
      });
      window.dispatchEvent(errorEvent);

      // Should not track the error
      expect(plausibleMock).not.toHaveBeenCalled();

      // Cleanup
      window.removeEventListener('error', errorHandler, true);
    });

    it('should cleanup error listeners on unmount', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useTelemetry({ enabled: true, trackErrors: true })
      );

      await waitFor(() => {
        expect(plausibleMock).toBeDefined();
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'unhandledrejection',
        expect.any(Function)
      );
    });
  });

  describe('Page View Tracking', () => {
    it('should track page views with Plausible', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackPageView();
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('pageview');
      });
    });

    it('should track page views with Google Analytics', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackPageView();
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
          path: '/test-path',
          title: 'Test Page',
          referrer: 'http://example.com',
        });
      });
    });

    it('should track page views with custom properties', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackPageView({
          path: '/custom-path',
          title: 'Custom Title',
          customProp: 'value',
        });
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
          path: '/custom-path',
          title: 'Custom Title',
          referrer: 'http://example.com',
          customProp: 'value',
        });
      });
    });

    it('should automatically track page views when trackPageViews is true', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      renderHook(() => useTelemetry({ enabled: true, trackPageViews: true }));

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('pageview');
      });
    });

    it('should track page views with custom path when currentPath is provided', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      renderHook(() =>
        useTelemetry({
          enabled: true,
          trackPageViews: true,
          currentPath: '/custom-spa-path',
        })
      );

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
          path: '/custom-spa-path',
          title: 'Test Page',
          referrer: 'http://example.com',
        });
      });
    });

    it('should re-track page views when currentPath changes', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { rerender } = renderHook(
        ({ currentPath }: TelemetryConfig) =>
          useTelemetry({
            enabled: true,
            trackPageViews: true,
            currentPath,
          }),
        { initialProps: { currentPath: '/page1' } }
      );

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
          path: '/page1',
          title: 'Test Page',
          referrer: 'http://example.com',
        });
      });

      gtagMock.mockClear();

      rerender({ currentPath: '/page2' });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
          path: '/page2',
          title: 'Test Page',
          referrer: 'http://example.com',
        });
      });
    });

    it('should log page views in debug mode', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, debug: true })
      );

      await waitFor(() => {
        result.current.trackPageView({ path: '/test' });
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry trackPageView]',
          { path: '/test' }
        );
      });
    });

    it('should not track page views when disabled', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: false }));

      result.current.trackPageView();

      expect(plausibleMock).not.toHaveBeenCalled();
    });
  });

  describe('User Identification', () => {
    it('should identify users with Google Analytics', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;
      (window as any).GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.identify('user123', { name: 'John Doe', plan: 'pro' });
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('config', 'G-XXXXXXXXXX', {
          user_id: 'user123',
        });
      });
    });

    it('should handle identify when GA_MEASUREMENT_ID is not set', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.identify('user123');
      });

      // Should not throw error, just not call gtag with config
      expect(gtagMock).not.toHaveBeenCalledWith(
        'config',
        expect.anything(),
        expect.anything()
      );
    });

    it('should identify users with custom provider', async () => {
      const customProvider: TelemetryProvider = {
        trackEvent: vi.fn(),
        trackError: vi.fn(),
        trackPageView: vi.fn(),
        identify: vi.fn(),
      };

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, provider: customProvider })
      );

      await waitFor(() => {
        result.current.identify('user123', { name: 'John Doe' });
      });

      expect(customProvider.identify).toHaveBeenCalledWith('user123', {
        name: 'John Doe',
      });
    });

    it('should handle identify when provider does not support it', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      // Should not throw error
      await waitFor(() => {
        result.current.identify('user123');
      });

      expect(true).toBe(true);
    });

    it('should log identify in debug mode', async () => {
      const customProvider: TelemetryProvider = {
        trackEvent: vi.fn(),
        trackError: vi.fn(),
        trackPageView: vi.fn(),
        identify: vi.fn(),
      };

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, provider: customProvider, debug: true })
      );

      await waitFor(() => {
        result.current.identify('user123', { name: 'John Doe' });
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry identify]',
          'user123',
          { name: 'John Doe' }
        );
      });
    });

    it('should not identify when disabled', async () => {
      const customProvider: TelemetryProvider = {
        trackEvent: vi.fn(),
        trackError: vi.fn(),
        trackPageView: vi.fn(),
        identify: vi.fn(),
      };

      const { result } = renderHook(() =>
        useTelemetry({ enabled: false, provider: customProvider })
      );

      result.current.identify('user123');

      expect(customProvider.identify).not.toHaveBeenCalled();
    });
  });

  describe('Hook State', () => {
    it('should return isEnabled as true when enabled', () => {
      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      expect(result.current.isEnabled).toBe(true);
    });

    it('should return isEnabled as false when disabled', () => {
      const { result } = renderHook(() => useTelemetry({ enabled: false }));

      expect(result.current.isEnabled).toBe(false);
    });

    it('should return isEnabled as true by default', () => {
      const { result } = renderHook(() => useTelemetry());

      expect(result.current.isEnabled).toBe(true);
    });
  });

  describe('Debug Mode', () => {
    it('should log provider detection in debug mode', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      renderHook(() => useTelemetry({ enabled: true, debug: true }));

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry] Using Plausible Analytics provider'
        );
      });
    });

    it('should log automatic page views in debug mode', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      renderHook(() =>
        useTelemetry({
          enabled: true,
          debug: true,
          trackPageViews: true,
          currentPath: '/debug-path',
        })
      );

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '[Telemetry] Page view tracked:',
          '/debug-path'
        );
      });
    });

    it('should not log when debug is false', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() =>
        useTelemetry({ enabled: true, debug: false })
      );

      await waitFor(() => {
        result.current.trackEvent('test_event');
      });

      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        '[Telemetry trackEvent]',
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle provider cleanup on config change', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result, rerender } = renderHook(
        ({ enabled }: TelemetryConfig) => useTelemetry({ enabled }),
        { initialProps: { enabled: true } }
      );

      await waitFor(() => {
        result.current.trackEvent('test_event_1');
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('test_event_1', {
          props: {},
        });
      });

      // Disable telemetry
      rerender({ enabled: false });

      plausibleMock.mockClear();
      result.current.trackEvent('test_event_2');

      expect(plausibleMock).not.toHaveBeenCalled();
    });

    it('should handle multiple hook instances', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result: result1 } = renderHook(() =>
        useTelemetry({ enabled: true })
      );
      const { result: result2 } = renderHook(() =>
        useTelemetry({ enabled: true })
      );

      await waitFor(() => {
        result1.current.trackEvent('event_1');
        result2.current.trackEvent('event_2');
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('event_1', { props: {} });
        expect(plausibleMock).toHaveBeenCalledWith('event_2', { props: {} });
      });
    });

    it('should handle empty event properties', async () => {
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackEvent('empty_event');
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('empty_event', {
          props: {},
        });
      });
    });

    it('should handle empty page view properties', async () => {
      gtagMock = vi.fn();
      (window as any).gtag = gtagMock;

      const { result } = renderHook(() => useTelemetry({ enabled: true }));

      await waitFor(() => {
        result.current.trackPageView({});
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
          path: '/test-path',
          title: 'Test Page',
          referrer: 'http://example.com',
        });
      });
    });

    it('should handle provider switch from custom to auto-detect', async () => {
      const customProvider: TelemetryProvider = {
        trackEvent: vi.fn(),
        trackError: vi.fn(),
        trackPageView: vi.fn(),
      };

      const { result, rerender } = renderHook(
        ({ provider }: TelemetryConfig) => useTelemetry({ enabled: true, provider }),
        { initialProps: { provider: customProvider } }
      );

      await waitFor(() => {
        result.current.trackEvent('custom_event');
      });

      expect(customProvider.trackEvent).toHaveBeenCalledWith('custom_event', {});

      // Switch to auto-detect
      plausibleMock = vi.fn();
      (window as any).plausible = plausibleMock;
      rerender({ provider: undefined });

      await waitFor(() => {
        result.current.trackEvent('plausible_event');
      });

      await waitFor(() => {
        expect(plausibleMock).toHaveBeenCalledWith('plausible_event', {
          props: {},
        });
      });
    });
  });
});
