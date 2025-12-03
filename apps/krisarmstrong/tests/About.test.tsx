import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import About from '../src/pages/About';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; className?: string }) =>
      React.createElement('div', props, children),
  },
}));

// Mock child components that may have complex dependencies
vi.mock('../src/components/Timeline', () => ({
  default: () => React.createElement('div', { 'data-testid': 'timeline' }, 'Timeline'),
}));

vi.mock('../src/components/Testimonials', () => ({
  default: () => React.createElement('div', { 'data-testid': 'testimonials' }, 'Testimonials'),
}));

const renderAbout = () => {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  );
};

describe('About', () => {
  it('renders Who I Am section', () => {
    renderAbout();

    expect(screen.getByRole('heading', { name: /who i am/i })).toBeInTheDocument();
    expect(screen.getByText(/kris armstrong/i)).toBeInTheDocument();
  });

  it('renders Key Achievements section', () => {
    renderAbout();

    expect(screen.getByRole('heading', { name: /key achievements/i })).toBeInTheDocument();
  });

  it('displays Wi-Fi Vigilante mention', () => {
    renderAbout();

    expect(screen.getByText(/wi-fi vigilante/i)).toBeInTheDocument();
  });

  it('lists certifications', () => {
    renderAbout();

    expect(screen.getByText(/CISSP, CWSP, CWDP, CWNA/)).toBeInTheDocument();
  });

  it('renders What Drives Me section', () => {
    renderAbout();

    expect(screen.getByRole('heading', { name: /what drives me/i })).toBeInTheDocument();
  });

  it('renders Open Source Contributions section', () => {
    renderAbout();

    expect(screen.getByRole('heading', { name: /open source/i })).toBeInTheDocument();
  });

  it('has link to projects page', () => {
    renderAbout();

    expect(screen.getByRole('link', { name: /view all projects/i })).toHaveAttribute(
      'href',
      '/projects'
    );
  });

  it('renders Timeline component', () => {
    renderAbout();

    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('renders Testimonials component', () => {
    renderAbout();

    expect(screen.getByTestId('testimonials')).toBeInTheDocument();
  });
});
