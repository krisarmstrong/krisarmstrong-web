import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Search from '../components/Search';

// Mock the SiteSearch component from web-foundation
vi.mock('@krisarmstrong/web-foundation', () => ({
  SiteSearch: vi.fn(({ placeholder }) => <div data-testid="site-search">{placeholder}</div>),
}));

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the SiteSearch component with correct props', () => {
    render(<Search />);

    const siteSearch = screen.getByTestId('site-search');
    expect(siteSearch).toBeInTheDocument();
    expect(siteSearch).toHaveTextContent('Search cases, sectors, pages...');
  });
});
