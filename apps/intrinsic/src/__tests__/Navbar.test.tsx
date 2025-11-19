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
          <div data-testid="navbar-nav-items">
            {props.navItems.map((item: { path: string; label: string }) => (
              <a key={item.path} href={item.path}>{item.label}</a>
            ))}
          </div>
          <div data-testid="navbar-desktop-actions">{props.desktopActions}</div>
          <div data-testid="navbar-mobile-actions">{props.mobileActions}</div>
          <div data-testid="navbar-mobile-footer">{props.mobileFooter}</div>
        </nav>
      );
    }),
    Button: vi.fn((props) => <button data-testid="mock-button" {...props}>{props.children}</button>),
  };
});

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

  it('passes the correct logo to WebFoundationNavbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const navbarLogo = screen.getByTestId('navbar-logo');
    expect(navbarLogo).toBeInTheDocument();
    expect(navbarLogo).toHaveTextContent('Intrinsic Momentum Mindset');
    expect(navbarLogo).toHaveTextContent('Coaching for leaders & creators');
    // Further checks could involve snapshot testing the logo or checking for img src
  });

  it('passes the correct navItems to WebFoundationNavbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const navbarNavItems = screen.getByTestId('navbar-nav-items');
    expect(navbarNavItems).toBeInTheDocument();
    PRIMARY_NAV.forEach(item => {
      expect(navbarNavItems).toHaveTextContent(item.label);
    });
  });

  it('passes the Button component to desktopActions and mobileActions', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const desktopActions = screen.getByTestId('navbar-desktop-actions');
    const mobileActions = screen.getByTestId('navbar-mobile-actions');

    expect(desktopActions).toBeInTheDocument();
    expect(desktopActions).toHaveTextContent('Book a Consult');
    expect(mobileActions).toBeInTheDocument();
    expect(mobileActions).toHaveTextContent('Book a Consult');
  });

  it('passes the correct variant to WebFoundationNavbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const webFoundationNavbarMock = vi.mocked(WebFoundationNavbar);
    const firstCallArgs = webFoundationNavbarMock.mock.calls[0][0];
    expect(firstCallArgs.variant).toBe('sage');
  });

  it('passes the correct mobileFooter to WebFoundationNavbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const mobileFooter = screen.getByTestId('navbar-mobile-footer');
    expect(mobileFooter).toBeInTheDocument();
    expect(mobileFooter).toHaveTextContent(`© ${new Date().getFullYear()} Intrinsic Momentum Mindset`);
  });
});
