import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../src/pages/Home';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; className?: string }) =>
      React.createElement('div', props, children),
  },
}));

// Mock useReducedMotion hook
vi.mock('@krisarmstrong/web-foundation', () => ({
  useReducedMotion: () => false,
}));

// Mock Typography components
vi.mock('../src/components/ui/Typography', () => ({
  H1: ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) =>
    React.createElement('h1', {}, icon, children),
  P: ({ children }: { children: React.ReactNode }) => React.createElement('p', {}, children),
}));

const renderHome = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe('Home', () => {
  it('renders the main heading with name', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /kris armstrong/i })).toBeInTheDocument();
  });

  it('displays certifications badge', () => {
    renderHome();

    // Multiple elements contain certifications - get the badge specifically
    const badges = screen.getAllByText(/CISSP.*CWSP.*CWDP.*CWNA/);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('shows revenue impact tagline', () => {
    renderHome();

    expect(screen.getByText(/\$33M\+ Revenue/i)).toBeInTheDocument();
  });

  it('renders all 6 value proposition cards', () => {
    renderHome();

    expect(screen.getByText('$33M Revenue Impact')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi Vigilante Platform')).toBeInTheDocument();
    expect(screen.getByText('CISSP + Wireless Expert')).toBeInTheDocument();
    expect(screen.getByText('Open Source Contributor')).toBeInTheDocument();
    expect(screen.getByText('Available for Consulting')).toBeInTheDocument();
    expect(screen.getByText('Technical Content Creator')).toBeInTheDocument();
  });

  it('has navigation links to key pages', () => {
    renderHome();

    expect(screen.getByRole('link', { name: /revenue impact/i })).toHaveAttribute(
      'href',
      '/resume'
    );
    expect(screen.getByRole('link', { name: /wireless expert/i })).toHaveAttribute(
      'href',
      '/skills'
    );
    expect(screen.getByRole('link', { name: /open source/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /consulting/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: /content creator/i })).toHaveAttribute('href', '/blog');
  });

  it('includes external link to Wi-Fi Vigilante', () => {
    renderHome();

    expect(screen.getByRole('link', { name: /wi-fi vigilante/i })).toHaveAttribute(
      'href',
      'https://wi-fi-vigilante.com'
    );
  });
});
