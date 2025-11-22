import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Contact from '../src/pages/Contact';

const contactFormSpy = vi.fn();

vi.mock('@krisarmstrong/web-foundation', async () => {
  const React = await import('react');

  const MockContactForm = (props: Record<string, unknown>) => {
    contactFormSpy(props);
    return React.createElement(
      'div',
      { 'data-testid': 'contact-form' },
      React.createElement('div', { 'data-testid': 'footer-slot' }, props.footer)
    );
  };
  MockContactForm.displayName = 'MockContactForm';

  return {
    ContactForm: MockContactForm,
  };
});

describe('Contact', () => {
  beforeEach(() => {
    contactFormSpy.mockClear();
    import.meta.env.VITE_FORMSPREE_ENDPOINT = 'https://formspree.io/f/test';
  });

  it('forwards env configuration and copy into ContactForm', () => {
    render(<Contact />);

    expect(contactFormSpy).toHaveBeenCalledTimes(1);
    expect(contactFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: 'https://formspree.io/f/test',
        tone: 'violet',
        background: 'dark',
        title: expect.stringMatching(/resilient/i),
        description: expect.stringMatching(/reach out/i),
        privacyNotice: expect.stringMatching(/no spam/i),
      })
    );
  });

  it('configures offline messaging when endpoint is missing', () => {
    import.meta.env.VITE_FORMSPREE_ENDPOINT = '';
    render(<Contact />);

    expect(contactFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '',
        offlineTitle: 'Contact form offline',
        offlineMessage: expect.stringMatching(/ping me on linkedin/i),
      })
    );
  });

  it('renders the footer links inside the shared form', () => {
    render(<Contact />);

    const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
    const githubLink = screen.getByRole('link', { name: /github/i });

    expect(linkedInLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/kris-armstrong-cissp/'
    );
    expect(githubLink).toHaveAttribute('href', 'https://github.com/krisarmstrong');
  });
});
