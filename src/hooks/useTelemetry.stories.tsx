import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useTelemetry } from './useTelemetry';
import type { TelemetryProvider, TelemetryEventProperties } from './useTelemetry';
import { Button } from '../components/ui/Button';
import { useState } from 'react';

const meta: Meta = {
  title: 'Hooks/useTelemetry',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * Basic usage example with event tracking
 */
export const BasicUsage: StoryFn = () => {
  const telemetry = useTelemetry({ enabled: true, debug: true });
  const [eventCount, setEventCount] = useState(0);

  const handleClick = () => {
    telemetry.trackEvent('button_clicked', {
      button: 'example_button',
      timestamp: Date.now(),
    });
    setEventCount((c) => c + 1);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Basic Telemetry Tracking</h2>
      <p className="text-gray-400">
        Click the button to track an event. Check the browser console to see the telemetry output.
      </p>
      <Button onClick={handleClick}>Track Event</Button>
      <p className="text-sm text-gray-500">Events tracked: {eventCount}</p>
    </div>
  );
};

/**
 * Error tracking example
 */
export const ErrorTracking: StoryFn = () => {
  const telemetry = useTelemetry({ enabled: true, debug: true });

  const trackSimpleError = () => {
    try {
      throw new Error('Example error for demonstration');
    } catch (error) {
      telemetry.trackError(error as Error);
    }
  };

  const trackCustomError = () => {
    telemetry.trackError({
      message: 'Custom error context',
      stack: 'Custom stack trace',
      componentStack: 'Component: ErrorTracking > Button',
      userId: 'user-123',
      action: 'form_submission',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Error Tracking</h2>
      <p className="text-gray-400">
        Track errors with full context. Check the browser console to see the error data.
      </p>
      <div className="flex gap-2">
        <Button onClick={trackSimpleError}>Track Simple Error</Button>
        <Button onClick={trackCustomError} variant="secondary">
          Track Custom Error
        </Button>
      </div>
    </div>
  );
};

/**
 * Page view tracking example
 */
export const PageViewTracking: StoryFn = () => {
  const telemetry = useTelemetry({ enabled: true, debug: true });

  const trackPageView = () => {
    telemetry.trackPageView({
      path: '/example/page',
      title: 'Example Page',
      referrer: 'https://example.com',
      category: 'documentation',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Page View Tracking</h2>
      <p className="text-gray-400">
        Track page views with custom properties. Check the browser console.
      </p>
      <Button onClick={trackPageView}>Track Page View</Button>
    </div>
  );
};

/**
 * User identification example
 */
export const UserIdentification: StoryFn = () => {
  const telemetry = useTelemetry({ enabled: true, debug: true });
  const [userId, setUserId] = useState('');

  const identifyUser = () => {
    if (!userId) return;

    telemetry.identify(userId, {
      email: `${userId}@example.com`,
      plan: 'premium',
      signupDate: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">User Identification</h2>
      <p className="text-gray-400">
        Identify users and associate events with them. Check the browser console.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button onClick={identifyUser} disabled={!userId}>
          Identify User
        </Button>
      </div>
    </div>
  );
};

/**
 * Custom provider example
 */
export const CustomProvider: StoryFn = () => {
  const [events, setEvents] = useState<string[]>([]);

  const customProvider: TelemetryProvider = {
    trackEvent: (eventName, properties) => {
      const message = `Event: ${eventName} | ${JSON.stringify(properties)}`;
      setEvents((prev) => [...prev, message]);
    },
    trackError: (error) => {
      const message = `Error: ${error instanceof Error ? error.message : error.message}`;
      setEvents((prev) => [...prev, message]);
    },
    trackPageView: (properties) => {
      const message = `Page View: ${JSON.stringify(properties)}`;
      setEvents((prev) => [...prev, message]);
    },
    identify: (userId, traits) => {
      const message = `Identify: ${userId} | ${JSON.stringify(traits)}`;
      setEvents((prev) => [...prev, message]);
    },
  };

  const telemetry = useTelemetry({
    enabled: true,
    provider: customProvider,
    debug: true,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Custom Telemetry Provider</h2>
      <p className="text-gray-400">
        Use a custom provider to capture telemetry data in-memory.
      </p>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => telemetry.trackEvent('custom_event', { action: 'click' })}>
          Track Event
        </Button>
        <Button onClick={() => telemetry.trackError({ message: 'Custom error' })}>
          Track Error
        </Button>
        <Button onClick={() => telemetry.trackPageView({ path: '/custom' })}>
          Track Page View
        </Button>
        <Button onClick={() => telemetry.identify('user-456', { role: 'admin' })}>
          Identify User
        </Button>
      </div>
      <div className="mt-4 p-4 bg-gray-900 rounded-lg">
        <h3 className="text-sm font-semibold text-white mb-2">Captured Events:</h3>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">No events yet. Click a button to track.</p>
        ) : (
          <ul className="space-y-1">
            {events.map((event, i) => (
              <li key={i} className="text-xs text-gray-400 font-mono">
                {event}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/**
 * Default properties example
 */
export const DefaultProperties: StoryFn = () => {
  const defaultProps: TelemetryEventProperties = {
    app: 'web-foundation',
    version: '0.9.0',
    environment: 'development',
  };

  const telemetry = useTelemetry({
    enabled: true,
    debug: true,
    defaultProperties: defaultProps,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Default Properties</h2>
      <p className="text-gray-400">
        All events include default properties. Check the console to see the merged properties.
      </p>
      <div className="mb-4 p-3 bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-400">Default properties:</p>
        <pre className="text-xs text-gray-500 mt-1">{JSON.stringify(defaultProps, null, 2)}</pre>
      </div>
      <Button
        onClick={() =>
          telemetry.trackEvent('button_clicked', {
            button: 'example',
            userId: 'user-789',
          })
        }
      >
        Track Event with Defaults
      </Button>
    </div>
  );
};

/**
 * Disabled telemetry example
 */
export const DisabledTelemetry: StoryFn = () => {
  const telemetry = useTelemetry({ enabled: false, debug: true });
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    telemetry.trackEvent('button_clicked', { button: 'disabled_example' });
    setClickCount((c) => c + 1);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Disabled Telemetry</h2>
      <p className="text-gray-400">
        When disabled, no events are tracked. Check the console - you should see no telemetry output.
      </p>
      <div className="p-3 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
        <p className="text-sm text-yellow-400">
          Telemetry is disabled. Events will not be tracked.
        </p>
      </div>
      <Button onClick={handleClick}>Try to Track Event</Button>
      <p className="text-sm text-gray-500">Button clicked: {clickCount} times (not tracked)</p>
    </div>
  );
};

/**
 * Automatic error tracking example
 */
export const AutomaticErrorTracking: StoryFn = () => {
  const telemetry = useTelemetry({
    enabled: true,
    debug: true,
    trackErrors: true,
  });

  const triggerError = () => {
    // This will be caught by the window error handler
    setTimeout(() => {
      throw new Error('Automatic error tracking test');
    }, 100);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Automatic Error Tracking</h2>
      <p className="text-gray-400">
        When enabled, uncaught errors are automatically tracked. Check the console.
      </p>
      <div className="p-3 bg-blue-900/20 border border-blue-600/50 rounded-lg">
        <p className="text-sm text-blue-400">
          Automatic error tracking is enabled. Uncaught errors will be logged.
        </p>
      </div>
      <Button onClick={triggerError}>Trigger Uncaught Error</Button>
    </div>
  );
};

/**
 * Form submission tracking example
 */
export const FormTracking: StoryFn = () => {
  const telemetry = useTelemetry({ enabled: true, debug: true });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    telemetry.trackEvent('form_submitted', {
      form: 'contact_form',
      fields: 2,
      hasName: !!formData.name,
      hasEmail: !!formData.email,
      timestamp: Date.now(),
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Form Submission Tracking</h2>
      <p className="text-gray-400">
        Track form submissions with metadata. Check the console.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button type="submit">Submit Form</Button>
      </form>
      {submitted && (
        <p className="text-sm text-green-400">Form submitted and tracked!</p>
      )}
    </div>
  );
};
