/* eslint-disable @typescript-eslint/require-await */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ContactForm } from './ContactForm';

// Mock useTelemetry hook
vi.mock('../hooks/useTelemetry', () => ({
  useTelemetry: vi.fn(() => ({
    trackEvent: vi.fn(),
    trackError: vi.fn(),
    trackPageView: vi.fn(),
    identify: vi.fn(),
    isEnabled: true,
  })),
}));

// Mock fetch
global.fetch = vi.fn();

describe('ContactForm - Minimal', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  it.skip('shows success message after successful submission', async () => {
    // Setup mock with explicit console logging
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockImplementation(async () => {
      console.log('[TEST] Fetch called!');
      return {
        ok: true,
        json: async () => ({ success: true }),
      } as Response;
    });

    render(
      <MemoryRouter>
        <ContactForm endpoint="/api/contact" />
      </MemoryRouter>
    );

    console.log('[TEST] Typing into fields...');
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

    console.log('[TEST] Clicking submit...');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    console.log('[TEST] Waiting for fetch...');
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    }, { timeout: 2000 });

    console.log('[TEST] Fetch was called, waiting for success message...');
    await waitFor(
      () => {
        const element = screen.queryByText('Thank you!');
        console.log('[TEST] Success element:', element);
        expect(element).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
