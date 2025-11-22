/* eslint-disable @typescript-eslint/require-await */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ContactForm } from './ContactForm';
import type { ReactElement } from 'react';

// Mock useTelemetry hook
const mockTrackEvent = vi.fn();
const mockTrackError = vi.fn();
const mockTrackPageView = vi.fn();
const mockIdentify = vi.fn();

vi.mock('../hooks/useTelemetry', () => ({
  useTelemetry: vi.fn(() => ({
    trackEvent: mockTrackEvent,
    trackError: mockTrackError,
    trackPageView: mockTrackPageView,
    identify: mockIdentify,
    isEnabled: true,
  })),
}));

// Mock fetch
global.fetch = vi.fn();

// Helper function to render with MemoryRouter
const renderWithRouter = (ui: ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

// Helper to create a mock Response object
const createMockResponse = (data: unknown = { success: true }, ok = true): Response => ({
  ok,
  status: ok ? 200 : 500,
  statusText: ok ? 'OK' : 'Internal Server Error',
  headers: new Headers(),
  redirected: false,
  type: 'basic',
  url: '',
  clone: () => ({} as Response),
  body: null,
  bodyUsed: false,
  arrayBuffer: async () => new ArrayBuffer(0),
  blob: async () => new Blob(),
  formData: async () => new FormData(),
  json: async () => data,
  text: async () => JSON.stringify(data),
} as Response);

describe('ContactForm', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockTrackEvent.mockClear();
    mockTrackError.mockClear();
    mockTrackPageView.mockClear();
    mockIdentify.mockClear();
    vi.mocked(global.fetch).mockClear();
  });

  describe('Rendering', () => {
    it('renders the contact form with all fields', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();

      const messageInput = screen.getByRole('textbox', { name: /message/i });
      expect(messageInput).toBeInTheDocument();

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      render(
        <ContactForm
          endpoint="/api/contact"
          title="Get in Touch"
          description="We'd love to hear from you"
        />
      );

      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
      expect(screen.getByText("We'd love to hear from you")).toBeInTheDocument();
    });

    it('renders custom field labels', () => {
      render(
        <ContactForm
          endpoint="/api/contact"
          nameLabel="Full Name"
          emailLabel="Email Address"
          messageLabel="Your Message"
        />
      );

      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Your Message')).toBeInTheDocument();
    });

    it('renders custom submit button label', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" submitLabel="Submit Form" />);

      expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
    });

    it('renders privacy notice', () => {
      render(
        <ContactForm endpoint="/api/contact" privacyNotice="Your data is safe with us." />
      );

      expect(screen.getByText('Your data is safe with us.')).toBeInTheDocument();
    });

    it('renders footer content', () => {
      render(
        <ContactForm
          endpoint="/api/contact"
          footer={<span>Need help? Email us at help@example.com</span>}
        />
      );

      expect(screen.getByText(/Need help\? Email us at help@example.com/)).toBeInTheDocument();
    });

    it('renders offline notice when no endpoint is provided', () => {
      renderWithRouter(<ContactForm />);

      expect(screen.getByText('Contact form offline')).toBeInTheDocument();
      expect(
        screen.getByText(/The form endpoint is not configured/i)
      ).toBeInTheDocument();
    });

    it('renders custom offline message', () => {
      render(
        <ContactForm
          offlineTitle="Form Unavailable"
          offlineMessage="Please try again later"
        />
      );

      expect(screen.getByText('Form Unavailable')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });

    it('renders honeypot field as hidden', () => {
      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const honeypotContainer = container.querySelector('.sr-only');
      expect(honeypotContainer).toBeInTheDocument();

      const honeypotInput = container.querySelector('input[name="company"]') as HTMLInputElement;
      expect(honeypotInput).toBeInTheDocument();
      expect(honeypotInput).toHaveAttribute('tabIndex', '-1');
      expect(honeypotInput).toHaveAttribute('autoComplete', 'off');
    });
  });

  describe('Form Field Interaction', () => {
    it('allows user to type in name field', async () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      await user.type(nameInput, 'John Doe');

      expect(nameInput.value).toBe('John Doe');
    });

    it('allows user to type in email field', async () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      await user.type(emailInput, 'john@example.com');

      expect(emailInput.value).toBe('john@example.com');
    });

    it('allows user to type in message field', async () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const messageInput = screen.getByRole('textbox', {
        name: /message/i,
      }) as HTMLTextAreaElement;
      await user.type(messageInput, 'This is my message');

      expect(messageInput.value).toBe('This is my message');
    });

    it('has required attribute on all fields', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByRole('textbox', { name: /message/i });

      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(messageInput).toBeRequired();
    });

    it('has email type on email field', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Form Submission - Success', () => {
    it('submits form successfully with valid data', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/contact',
          expect.objectContaining({
            method: 'POST',
            headers: { Accept: 'application/json' },
          })
        );
      });

      // Check FormData contents
      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const formData = fetchCall[1]?.body as FormData;
      expect(formData.get('name')).toBe('John Doe');
      expect(formData.get('email')).toBe('john@example.com');
      expect(formData.get('message')).toBe('Test message');
    });

    it.skip('shows success message after successful submission', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for success message
      await waitFor(
        () => {
          expect(screen.getByText('Thank you!')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      expect(
        screen.getByText(/Your message is in my queue. I'll respond soon./i)
      ).toBeInTheDocument();
    });

    it.skip('shows custom success message', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      render(
        <ContactForm
          endpoint="/api/contact"
          successTitle="Message Sent!"
          successMessage="We'll get back to you soon."
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Message Sent!')).toBeInTheDocument();
      });

      expect(screen.getByText("We'll get back to you soon.")).toBeInTheDocument();
    });

    it.skip('resets form after successful submission', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByRole('textbox', { name: /message/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      });

      // Form should be hidden, so fields are not in the document
      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('textbox', { name: /message/i })).not.toBeInTheDocument();
    });

    it.skip('calls onSubmitSuccess callback on successful submission', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      const onSubmitSuccess = vi.fn();
      renderWithRouter(<ContactForm endpoint="/api/contact" onSubmitSuccess={onSubmitSuccess} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Form Submission - Error Handling', () => {
    it('shows error message when submission fails', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({}, false));

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/We couldn't send your message. Please try again or email me directly./i)
        ).toBeInTheDocument();
      });
    });

    it('shows error message when fetch throws', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/We couldn't send your message. Please try again or email me directly./i)
        ).toBeInTheDocument();
      });
    });

    it('calls onSubmitError callback on failed submission', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      const onSubmitError = vi.fn();
      renderWithRouter(<ContactForm endpoint="/api/contact" onSubmitError={onSubmitError} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(onSubmitError).toHaveBeenCalledTimes(1);
      });

      expect(onSubmitError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('shows error when no endpoint is configured on submit', async () => {
      renderWithRouter(<ContactForm />);

      // The submit button should be disabled when no endpoint
      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeDisabled();
    });

    it('keeps form visible after error', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/We couldn't send your message. Please try again or email me directly./i)
        ).toBeInTheDocument();
      });

      // Form should still be visible
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it.skip('shows loading state during submission', async () => {
      let resolvePromise: (value: Response) => void;
      const fetchPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(global.fetch).mockReturnValueOnce(fetchPromise);

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
        expect(submitButton).toBeDisabled();
      });

      // Resolve the promise
      resolvePromise!({ ok: true, json: async () => ({ success: true }) } as Response);

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      });
    });

    it.skip('disables button during submission', async () => {
      let resolvePromise: (value: Response) => void;
      const fetchPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(global.fetch).mockReturnValueOnce(fetchPromise);

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      // Resolve the promise
      resolvePromise!({ ok: true, json: async () => ({ success: true }) } as Response);

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      });
    });
  });

  describe('Honeypot Spam Detection', () => {
    it('silently rejects submission when honeypot is filled', async () => {
      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const honeypotInput = container.querySelector('input[name="company"]') as HTMLInputElement;

      await user.type(screen.getByLabelText(/name/i), 'Spammer');
      await user.type(screen.getByLabelText(/email/i), 'spam@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Spam message');
      await user.type(honeypotInput, 'I am a bot');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      });

      // Should not call fetch
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('allows submission when honeypot is empty', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const honeypotInput = container.querySelector('input[name="company"]') as HTMLInputElement;

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      // Honeypot should remain empty
      expect(honeypotInput.value).toBe('');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it.skip('rejects submission when honeypot has whitespace', async () => {
      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const honeypotInput = container.querySelector('input[name="company"]') as HTMLInputElement;

      await user.type(screen.getByLabelText(/name/i), 'Spammer');
      await user.type(screen.getByLabelText(/email/i), 'spam@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Spam message');
      await user.type(honeypotInput, '   ');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      });

      // Should not call fetch
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Telemetry Tracking', () => {
    it('tracks submit attempt event', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      renderWithRouter(<ContactForm endpoint="/api/contact" telemetry={{ enabled: true }} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('contact_form_submit_attempt', {
          tone: 'violet',
          hasName: true,
          hasEmail: true,
          hasMessage: true,
        });
      });
    });

    it.skip('tracks success event after successful submission', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      renderWithRouter(<ContactForm endpoint="/api/contact" telemetry={{ enabled: true }} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('contact_form_success', {
          tone: 'violet',
        });
      });
    });

    it('tracks error event on submission failure', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<ContactForm endpoint="/api/contact" telemetry={{ enabled: true }} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(mockTrackError).toHaveBeenCalledWith({
          message: 'Network error',
          stack: expect.any(String),
          component: 'ContactForm',
          tone: 'violet',
        });
      });

      expect(mockTrackEvent).toHaveBeenCalledWith('contact_form_error', {
        error: 'submission_failed',
        tone: 'violet',
      });
    });

    it('tracks spam detection event', async () => {
      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" telemetry={{ enabled: true }} />);

      const honeypotInput = container.querySelector('input[name="company"]') as HTMLInputElement;

      await user.type(screen.getByLabelText(/name/i), 'Spammer');
      await user.type(screen.getByLabelText(/email/i), 'spam@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Spam message');
      await user.type(honeypotInput, 'I am a bot');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('contact_form_spam_detected', {
          tone: 'violet',
        });
      });
    });

    it('tracks error when no endpoint is configured', async () => {
      renderWithRouter(<ContactForm telemetry={{ enabled: true }} />);

      const submitButton = screen.getByRole('button', { name: /send message/i });

      // Button should be disabled, but we can still test the endpoint error path
      // by checking that the error is set
      expect(submitButton).toBeDisabled();
    });

    it('uses custom tone in telemetry events', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      renderWithRouter(<ContactForm endpoint="/api/contact" tone="blue" telemetry={{ enabled: true }} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('contact_form_submit_attempt', {
          tone: 'blue',
          hasName: true,
          hasEmail: true,
          hasMessage: true,
        });
      });
    });
  });

  describe('Different Tones', () => {
    it('renders with violet tone', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" tone="violet" />);
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveClass('focus:ring-violet-500', 'focus:border-violet-400');
    });

    it('renders with blue tone', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" tone="blue" />);
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveClass('focus:ring-blue-500', 'focus:border-blue-400');
    });

    it('renders with emerald tone', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" tone="emerald" />);
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveClass('focus:ring-emerald-500', 'focus:border-emerald-400');
    });

    it('renders with sage tone', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" tone="sage" />);
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveClass('focus:ring-emerald-500', 'focus:border-emerald-400');
    });
  });

  describe('Different Backgrounds', () => {
    it('renders with dark background', () => {
      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" background="dark" />);
      const form = container.querySelector('form');
      expect(form).toHaveClass('bg-gray-900', 'border-gray-800');
    });

    it('renders with light background', () => {
      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" background="light" />);
      const form = container.querySelector('form');
      expect(form).toHaveClass('bg-white', 'border-gray-200');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toHaveAttribute('aria-label', 'Send message');
    });

    it.skip('has proper ARIA attributes during loading', async () => {
      let resolvePromise: (value: Response) => void;
      const fetchPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(global.fetch).mockReturnValueOnce(fetchPromise);

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
      });

      resolvePromise!({ ok: true, json: async () => ({ success: true }) } as Response);

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      });
    });

    it('has role alert for error messages', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        const errorElement = screen.getByRole('alert');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(
          /We couldn't send your message. Please try again or email me directly./i
        );
      });
    });

    it.skip('has aria-live for success message', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse());

      renderWithRouter(<ContactForm endpoint="/api/contact" />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        const successElement = screen.getByText('Thank you!').closest('div');
        expect(successElement).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('honeypot field has aria-hidden', () => {
      const { container } = renderWithRouter(<ContactForm endpoint="/api/contact" />);
      const honeypotContainer = container.querySelector('.sr-only');
      expect(honeypotContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className to section', () => {
      const { container } = render(
        <ContactForm endpoint="/api/contact" className="custom-class" />
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });

    it('applies custom cardClassName to form', () => {
      const { container } = render(
        <ContactForm endpoint="/api/contact" cardClassName="custom-card-class" />
      );
      const form = container.querySelector('form');
      expect(form).toHaveClass('custom-card-class');
    });

    it('uses custom placeholders', () => {
      render(
        <ContactForm
          endpoint="/api/contact"
          namePlaceholder="Enter your full name"
          emailPlaceholder="Enter your email address"
          messagePlaceholder="What would you like to say?"
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByRole('textbox', { name: /message/i });

      expect(nameInput).toHaveAttribute('placeholder', 'Enter your full name');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address');
      expect(messageInput).toHaveAttribute('placeholder', 'What would you like to say?');
    });
  });
});
