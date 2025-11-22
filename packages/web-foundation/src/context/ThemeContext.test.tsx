/**
 * @fileoverview Tests for ThemeContext and ThemeProvider
 * Tests theme application, color mode switching, and CSS variable injection
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme, defaultDarkTheme } from './ThemeContext';

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear any applied styles
    document.documentElement.className = '';
    document.documentElement.style.cssText = '';
  });

  describe('ThemeProvider', () => {
    it('provides theme to children', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-check">{theme.brand?.primary}</div>;
      };

      render(
        <ThemeProvider initialTheme={defaultDarkTheme}>
          <TestComponent />
        </ThemeProvider>
      );

      const element = screen.getByTestId('theme-check');
      expect(element.textContent).toBeTruthy();
    });

    it('applies color mode class to document', () => {
      render(
        <ThemeProvider initialTheme={defaultDarkTheme} initialMode="dark">
          <div>Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('switches to light mode', () => {
      const TestComponent = () => {
        const { mode, setMode } = useTheme();
        return <button onClick={() => setMode('light')}>Current: {mode}</button>;
      };

      render(
        <ThemeProvider initialTheme={defaultDarkTheme} initialMode="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      const button = screen.getByRole('button');
      act(() => {
        button.click();
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('sets CSS custom properties', () => {
      const customTheme = {
        brand: { primary: '#ff0000' },
        text: { primary: '#ffffff' },
      };

      render(
        <ThemeProvider initialTheme={customTheme}>
          <div>Content</div>
        </ThemeProvider>
      );

      const root = document.documentElement;
      const primaryColor = root.style.getPropertyValue('--color-brand-primary');
      expect(primaryColor).toBe('#ff0000');
    });

    it('allows theme updates when allowThemeUpdates is true', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        const updateTheme = () => {
          setTheme({
            ...theme,
            brand: { ...theme.brand, primary: '#00ff00' },
          });
        };
        return (
          <div>
            <div data-testid="color">{theme.brand?.primary}</div>
            <button onClick={updateTheme}>Update</button>
          </div>
        );
      };

      render(
        <ThemeProvider initialTheme={defaultDarkTheme} allowThemeUpdates={true}>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      act(() => {
        button.click();
      });

      expect(screen.getByTestId('color').textContent).toBe('#00ff00');
    });

    it('prevents theme updates when allowThemeUpdates is false', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        const updateTheme = () => {
          setTheme({
            ...theme,
            brand: { ...theme.brand, primary: '#00ff00' },
          });
        };
        return (
          <div>
            <div data-testid="color">{theme.brand?.primary}</div>
            <button onClick={updateTheme}>Update</button>
          </div>
        );
      };

      render(
        <ThemeProvider initialTheme={defaultDarkTheme} allowThemeUpdates={false}>
          <TestComponent />
        </ThemeProvider>
      );

      const initialColor = screen.getByTestId('color').textContent;
      const button = screen.getByRole('button');

      act(() => {
        button.click();
      });

      expect(screen.getByTestId('color').textContent).toBe(initialColor);
    });

    it('handles auto color mode based on system preference', () => {
      // Mock matchMedia to return dark mode preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider initialTheme={defaultDarkTheme} initialMode="auto">
          <div>Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('useTheme', () => {
    it('throws error when used outside ThemeProvider', () => {
      const TestComponent = () => {
        useTheme();
        return null;
      };

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      );

      consoleSpy.mockRestore();
    });

    it('returns theme context value', () => {
      const TestComponent = () => {
        const context = useTheme();
        return (
          <div>
            <div data-testid="has-theme">{typeof context.theme === 'object' ? 'yes' : 'no'}</div>
            <div data-testid="has-mode">{typeof context.mode === 'string' ? 'yes' : 'no'}</div>
            <div data-testid="has-setTheme">
              {typeof context.setTheme === 'function' ? 'yes' : 'no'}
            </div>
            <div data-testid="has-setMode">
              {typeof context.setMode === 'function' ? 'yes' : 'no'}
            </div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-theme').textContent).toBe('yes');
      expect(screen.getByTestId('has-mode').textContent).toBe('yes');
      expect(screen.getByTestId('has-setTheme').textContent).toBe('yes');
      expect(screen.getByTestId('has-setMode').textContent).toBe('yes');
    });
  });

  describe('CSS Color Validation', () => {
    it('accepts valid CSS colors', () => {
      const validTheme = {
        brand: { primary: '#ff0000' },
        surface: { base: 'rgb(255, 255, 255)' },
        text: { primary: 'hsl(0, 0%, 100%)' },
      };

      render(
        <ThemeProvider initialTheme={validTheme}>
          <div>Content</div>
        </ThemeProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--color-brand-primary')).toBe('#ff0000');
    });

    it('accepts CSS variables', () => {
      const cssVarTheme = {
        brand: { primary: 'var(--my-color)' },
      };

      render(
        <ThemeProvider initialTheme={cssVarTheme}>
          <div>Content</div>
        </ThemeProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--color-brand-primary')).toBe('var(--my-color)');
    });
  });

  describe('Theme switching', () => {
    it('updates CSS variables when theme changes', () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        const changeTheme = () => {
          setTheme({
            brand: { primary: '#00ff00', accent: '#0000ff' },
          });
        };
        return <button onClick={changeTheme}>Change Theme</button>;
      };

      render(
        <ThemeProvider initialTheme={defaultDarkTheme}>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      act(() => {
        button.click();
      });

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--color-brand-primary')).toBe('#00ff00');
      expect(root.style.getPropertyValue('--color-brand-accent')).toBe('#0000ff');
    });

    it('removes old mode class when mode changes', () => {
      const TestComponent = () => {
        const { setMode } = useTheme();
        return (
          <>
            <button onClick={() => setMode('light')}>Light</button>
            <button onClick={() => setMode('dark')}>Dark</button>
          </>
        );
      };

      render(
        <ThemeProvider initialMode="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      const lightButton = screen.getByRole('button', { name: 'Light' });
      act(() => {
        lightButton.click();
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
