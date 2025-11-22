import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock the BaseNavbar component from web-foundation
vi.mock('@krisarmstrong/web-foundation', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navbar: vi.fn((props) => (
      <nav data-testid="mock-navbar">
        <div data-testid="navbar-logo">{props.logo}</div>
        <div data-testid="navbar-nav-items">
          {props.navItems?.map((item: { label: string; path: string }) => (
            <a key={item.path} href={item.path}>
              {item.label}
            </a>
          ))}
        </div>
        <div data-testid="navbar-desktop-actions">{props.desktopActions}</div>
        <div data-testid="navbar-mobile-actions">{props.mobileActions}</div>
        {props.mobileFooter && <div data-testid="navbar-mobile-footer">{props.mobileFooter}</div>}
      </nav>
    )),
    ThemeToggle: vi.fn(() => <div data-testid="mock-theme-toggle">Theme Toggle</div>),
  };
});

describe('Navbar', () => {
  it('renders the navbar with logo and navigation', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-logo')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-nav-items')).toBeInTheDocument();
  });

  it('includes theme toggle in desktop and mobile actions', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const desktopActions = screen.getByTestId('navbar-desktop-actions');
    const mobileActions = screen.getByTestId('navbar-mobile-actions');

    expect(desktopActions).toBeInTheDocument();
    expect(mobileActions).toBeInTheDocument();
    expect(desktopActions).toHaveTextContent('Theme Toggle');
    expect(mobileActions).toHaveTextContent('Theme Toggle');
  });

  it('includes mobile footer', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByTestId('navbar-mobile-footer')).toBeInTheDocument();
  });
});
