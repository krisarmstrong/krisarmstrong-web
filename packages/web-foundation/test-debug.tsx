import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ContactForm } from './src/components/ContactForm';

vi.mock('./src/hooks/useTelemetry', () => ({
  useTelemetry: vi.fn(() => ({
    trackEvent: vi.fn(),
    trackError: vi.fn(),
    trackPageView: vi.fn(),
    identify: vi.fn(),
    isEnabled: true,
  })),
}));

describe('ContactForm Debug', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('shows success message after successful submission', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    vi.stubGlobal('fetch', mockFetch);

    render(
      <MemoryRouter>
        <ContactForm endpoint="/api/contact" />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    console.log('Fetch called:', mockFetch.mock.calls.length);

    await waitFor(
      () => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    vi.unstubAllGlobals();
  });
});
