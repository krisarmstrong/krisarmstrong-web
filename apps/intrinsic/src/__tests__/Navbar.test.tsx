import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Navbar as WebFoundationNavbar } from '@krisarmstrong/web-foundation';
import { PRIMARY_NAV } from '../config/navigation';

// Mock the WebFoundationNavbar component from web-foundation
vi.mock('@krisarmstrong/web-foundation', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navbar: vi.fn((props) => {
      // Render a simplified version of Navbar for testing purposes
      return (
        <nav data-testid="mock-webfoundation-navbar">
          <div data-testid="navbar-logo">{props.logo}</div>
          <div data-testid="navbar-title">{props.title}</div>
          <div data-testid="navbar-nav-items">
            {props.navItems?.map((item: { path: string; label: string }) => (
              <a key={item.path} href={item.path}>
                {item.label}
              </a>
            ))}
          </div>
          <div data-testid="navbar-desktop-actions">{props.desktopActions}</div>
          <div data-testid="navbar-mobile-actions">{props.mobileActions}</div>
          <div data-testid="navbar-mobile-footer">{props.mobileFooter}</div>
        </nav>
      );
    }),
    Button: vi.fn((props) => (
      <button data-testid="mock-button" {...props}>
        {props.children}
      </button>
    )),
    ThemeToggle: vi.fn(() => <div data-testid="mock-theme-toggle">Theme Toggle</div>),
  };
});

// Helper function to wrap component with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar', () => {
  it('renders the WebFoundationNavbar component', () => {
    renderWithProviders(<Navbar />);

    // Check if the mock WebFoundationNavbar is rendered
    expect(screen.getByTestId('mock-webfoundation-navbar')).toBeInTheDocument();
  });

  it('passes the correct logo and title to WebFoundationNavbar', () => {
    renderWithProviders(<Navbar />);

    const navbarLogo = screen.getByTestId('navbar-logo');
    expect(navbarLogo).toBeInTheDocument();

    const navbarTitle = screen.getByTestId('navbar-title');
    expect(navbarTitle).toBeInTheDocument();
    expect(navbarTitle).toHaveTextContent('Intrinsic Momentum Mindset');
  });

  it('passes the correct navItems to WebFoundationNavbar', () => {
    renderWithProviders(<Navbar />);

    const navbarNavItems = screen.getByTestId('navbar-nav-items');
    expect(navbarNavItems).toBeInTheDocument();
    PRIMARY_NAV.forEach((item) => {
      expect(navbarNavItems).toHaveTextContent(item.label);
    });
  });

  it('passes the ThemeToggle component to desktopActions and mobileActions', () => {
    renderWithProviders(<Navbar />);

    const desktopActions = screen.getByTestId('navbar-desktop-actions');
    const mobileActions = screen.getByTestId('navbar-mobile-actions');

    expect(desktopActions).toBeInTheDocument();
    expect(desktopActions).toHaveTextContent('Theme Toggle');
    expect(mobileActions).toBeInTheDocument();
    expect(mobileActions).toHaveTextContent('Theme Toggle');
  });

  it('passes the correct variant to WebFoundationNavbar', () => {
    renderWithProviders(<Navbar />);

    const webFoundationNavbarMock = vi.mocked(WebFoundationNavbar);
    const firstCallArgs = webFoundationNavbarMock.mock.calls[0][0];
    expect(firstCallArgs.variant).toBe('sage');
  });

  it('passes the correct mobileFooter to WebFoundationNavbar', () => {
    renderWithProviders(<Navbar />);

    const mobileFooter = screen.getByTestId('navbar-mobile-footer');
    expect(mobileFooter).toBeInTheDocument();
    expect(mobileFooter).toHaveTextContent(
      `© ${new Date().getFullYear()} Intrinsic Momentum Mindset`
    );
  });
});
