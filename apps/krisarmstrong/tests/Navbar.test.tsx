import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import { PRIMARY_NAV } from '../src/config/navigation';

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
    SiteSearch: vi.fn((props) => (
      <div data-testid="mock-sitesearch">{props.placeholder || 'Mock SiteSearch'}</div>
    )),
    ThemeToggle: vi.fn(() => <div data-testid="mock-theme-toggle">Theme Toggle</div>),
  };
});

// No need to mock ../components/Search directly if SiteSearch is mocked
// vi.mock('../components/Search', () => ({
//   default: () => <div data-testid="mock-search">Mock Search</div>,
// }));

describe('Navbar', () => {
  it('renders the WebFoundationNavbar component', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check if the mock WebFoundationNavbar is rendered
    expect(screen.getByTestId('mock-webfoundation-navbar')).toBeInTheDocument();
  });

  it('passes the correct logo and title to WebFoundationNavbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const navbarLogo = screen.getByTestId('navbar-logo');
    expect(navbarLogo).toBeInTheDocument();

    const navbarTitle = screen.getByTestId('navbar-title');
    expect(navbarTitle).toBeInTheDocument();
    expect(navbarTitle).toHaveTextContent('Kris Armstrong');
    expect(navbarTitle).toHaveTextContent('CISSP | CWSP | CWDP | CWNA');
  });

  it('passes the correct navItems to WebFoundationNavbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const navbarNavItems = screen.getByTestId('navbar-nav-items');
    expect(navbarNavItems).toBeInTheDocument();
    PRIMARY_NAV.forEach((item) => {
      expect(navbarNavItems).toHaveTextContent(item.label);
    });
  });

  it('passes the ThemeToggle component to desktopActions and mobileActions', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const desktopActions = screen.getByTestId('navbar-desktop-actions');
    const mobileActions = screen.getByTestId('navbar-mobile-actions');

    expect(desktopActions).toBeInTheDocument();
    expect(desktopActions).toHaveTextContent('Theme Toggle');
    expect(mobileActions).toBeInTheDocument();
    expect(mobileActions).toHaveTextContent('Theme Toggle');
  });

  it('passes the correct mobileFooter to WebFoundationNavbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const mobileFooter = screen.getByTestId('navbar-mobile-footer');
    expect(mobileFooter).toBeInTheDocument();
    expect(mobileFooter).toHaveTextContent(`© ${new Date().getFullYear()} Kris Armstrong`);
  });
});
