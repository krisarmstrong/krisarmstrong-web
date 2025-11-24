/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Button } from './Button';

// Mock react-router-dom's Link component to avoid router provider requirement
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, className, children, ...props }: any) => (
      <a href={to} className={className} {...props}>
        {children}
      </a>
    ),
  };
});

describe('Button', () => {
  // Original test - keep it
  it('renders the button with the correct text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  describe('Button variants', () => {
    it('renders primary variant', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button', { name: /primary/i });
      expect(button).toHaveClass('bg-[var(--color-interactive-default)]');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button', { name: /secondary/i });
      expect(button).toHaveClass('bg-[var(--color-surface-raised)]');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button', { name: /danger/i });
      expect(button).toHaveClass('bg-[var(--color-status-error)]');
    });

    it('renders warning variant', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button', { name: /warning/i });
      expect(button).toHaveClass('bg-[var(--color-status-warning)]');
    });

    it('renders success variant', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button', { name: /success/i });
      expect(button).toHaveClass('bg-[var(--color-status-success)]');
    });

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button', { name: /outline/i });
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('bg-transparent');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button', { name: /ghost/i });
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('Button sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button', { name: /small/i });
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders medium size (default)', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button', { name: /medium/i });
      expect(button).toHaveClass('px-4', 'py-2');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button', { name: /large/i });
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });

  describe('Loading state', () => {
    it('shows spinner when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toContainElement(button.querySelector('svg'));
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('shows aria-busy attribute when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('shows loading screen reader text', () => {
      render(<Button isLoading>Loading</Button>);
      const srText = screen.getByText('Loading...');
      expect(srText).toHaveClass('sr-only');
    });

    it('hides left icon when loading', () => {
      render(
        <Button isLoading leftIcon={<span>Icon</span>}>
          Text
        </Button>
      );
      const icon = screen.queryByText('Icon');
      expect(icon).not.toBeInTheDocument();
    });

    it('hides right icon when loading', () => {
      render(
        <Button isLoading rightIcon={<span>Icon</span>}>
          Text
        </Button>
      );
      const icon = screen.queryByText('Icon');
      expect(icon).not.toBeInTheDocument();
    });

    it('shows spinner with margin when there is text', () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('mr-2');
    });

    it('shows spinner without margin when there is no text', () => {
      const { container } = render(<Button isLoading />);
      const svg = container.querySelector('svg');
      expect(svg).not.toHaveClass('mr-2');
    });
  });

  describe('Disabled state', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-60', 'disabled:cursor-not-allowed');
    });

    it('does not trigger onClick when disabled', () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Click
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Icons', () => {
    it('renders left icon', () => {
      render(<Button leftIcon={<span>LeftIcon</span>}>Text</Button>);
      const icon = screen.getByText('LeftIcon');
      expect(icon).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(<Button rightIcon={<span>RightIcon</span>}>Text</Button>);
      const icon = screen.getByText('RightIcon');
      expect(icon).toBeInTheDocument();
    });

    it('renders both icons', () => {
      render(
        <Button leftIcon={<span>LeftIcon</span>} rightIcon={<span>RightIcon</span>}>
          Text
        </Button>
      );
      expect(screen.getByText('LeftIcon')).toBeInTheDocument();
      expect(screen.getByText('RightIcon')).toBeInTheDocument();
    });

    it('applies margin to left icon when there is text', () => {
      render(<Button leftIcon={<span>LeftIcon</span>}>Text</Button>);
      const iconSpan = screen.getByText('LeftIcon').parentElement;
      expect(iconSpan).toHaveClass('mr-1.5', '-ml-0.5');
    });

    it('does not apply margin to left icon when there is no text', () => {
      render(<Button leftIcon={<span>LeftIcon</span>} />);
      const iconSpan = screen.getByText('LeftIcon').parentElement;
      expect(iconSpan).not.toHaveClass('mr-1.5');
    });

    it('applies margin to right icon when there is text', () => {
      render(<Button rightIcon={<span>RightIcon</span>}>Text</Button>);
      const iconSpan = screen.getByText('RightIcon').parentElement;
      expect(iconSpan).toHaveClass('ml-1.5', '-mr-0.5');
    });

    it('does not apply margin to right icon when there is no text', () => {
      render(<Button rightIcon={<span>RightIcon</span>} />);
      const iconSpan = screen.getByText('RightIcon').parentElement;
      expect(iconSpan).not.toHaveClass('ml-1.5');
    });
  });

  describe('Polymorphic rendering', () => {
    describe('as button (default)', () => {
      it('renders as button element', () => {
        render(<Button>Button</Button>);
        const button = screen.getByRole('button');
        expect(button.tagName.toLowerCase()).toBe('button');
      });

      it('supports button type prop', () => {
        render(<Button type="submit">Submit</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
      });

      it('supports reset type', () => {
        render(<Button type="reset">Reset</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'reset');
      });

      it('handles onClick events', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click me</Button>);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
      });

      it('passes onClick with correct event type', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledWith(expect.any(Object));
      });
    });

    describe('as Link', () => {
      it('renders as link element when as="Link"', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path">
              Link
            </Button>
          </BrowserRouter>
        );
        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
      });

      it('throws error when Link without to prop', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
          render(
            <Button as="Link" to={undefined as any}>
              Link
            </Button>
          );
        }).toThrow('Button with as="Link" must have a "to" prop');
        consoleSpy.mockRestore();
      });

      it('navigates to the specified path', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/destination">
              Navigate
            </Button>
          </BrowserRouter>
        );
        const link = screen.getByRole('link') as HTMLAnchorElement;
        expect(link.href).toContain('/destination');
      });

      it('applies button classes to Link', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path">
              Link
            </Button>
          </BrowserRouter>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
      });

      it('supports variant on Link', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" variant="danger">
              Link
            </Button>
          </BrowserRouter>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveClass('bg-[var(--color-status-error)]');
      });

      it('supports size on Link', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" size="lg">
              Link
            </Button>
          </BrowserRouter>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveClass('px-6', 'py-3', 'text-base');
      });

      it('shows loading state on Link', () => {
        const { container } = render(
          <BrowserRouter>
            <Button as="Link" to="/path" isLoading>
              Loading
            </Button>
          </BrowserRouter>
        );
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });

      it('shows spinner without margin on Link when no text', () => {
        const { container } = render(
          <BrowserRouter>
            <Button as="Link" to="/path" isLoading />
          </BrowserRouter>
        );
        const svg = container.querySelector('svg');
        expect(svg).not.toHaveClass('mr-2');
      });

      it('renders left icon on Link', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" leftIcon={<span>Icon</span>}>
              Text
            </Button>
          </BrowserRouter>
        );
        const icon = screen.getByText('Icon');
        expect(icon).toBeInTheDocument();
      });

      it('renders right icon on Link', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" rightIcon={<span>Icon</span>}>
              Text
            </Button>
          </BrowserRouter>
        );
        const icon = screen.getByText('Icon');
        expect(icon).toBeInTheDocument();
      });

      it('applies left icon margin on Link when there is text', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" leftIcon={<span>LeftIcon</span>}>
              Text
            </Button>
          </BrowserRouter>
        );
        const iconSpan = screen.getByText('LeftIcon').parentElement;
        expect(iconSpan).toHaveClass('mr-1.5', '-ml-0.5');
      });

      it('does not apply left icon margin on Link when no text', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" leftIcon={<span>LeftIcon</span>} />
          </BrowserRouter>
        );
        const iconSpan = screen.getByText('LeftIcon').parentElement;
        expect(iconSpan).not.toHaveClass('mr-1.5');
      });

      it('applies right icon margin on Link when there is text', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" rightIcon={<span>RightIcon</span>}>
              Text
            </Button>
          </BrowserRouter>
        );
        const iconSpan = screen.getByText('RightIcon').parentElement;
        expect(iconSpan).toHaveClass('ml-1.5', '-mr-0.5');
      });

      it('does not apply right icon margin on Link when no text', () => {
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" rightIcon={<span>RightIcon</span>} />
          </BrowserRouter>
        );
        const iconSpan = screen.getByText('RightIcon').parentElement;
        expect(iconSpan).not.toHaveClass('ml-1.5');
      });

      it('handles onClick on Link', () => {
        const onClick = vi.fn();
        render(
          <BrowserRouter>
            <Button as="Link" to="/path" onClick={onClick}>
              Link
            </Button>
          </BrowserRouter>
        );
        const link = screen.getByRole('link');
        fireEvent.click(link);
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('as anchor (a tag)', () => {
      it('renders as anchor element when as="a"', () => {
        render(
          <Button as="a" href="https://example.com">
            Anchor
          </Button>
        );
        const link = screen.getByRole('link');
        expect(link.tagName.toLowerCase()).toBe('a');
      });

      it('uses href prop', () => {
        render(
          <Button as="a" href="https://example.com">
            Link
          </Button>
        );
        const link = screen.getByRole('link') as HTMLAnchorElement;
        expect(link.href).toBe('https://example.com/');
      });

      it('falls back to to prop if href is not provided', () => {
        render(
          <Button as="a" to="/path">
            Link
          </Button>
        );
        const link = screen.getByRole('link') as HTMLAnchorElement;
        expect(link.href).toContain('/path');
      });

      it('prefers href over to prop', () => {
        render(
          <Button as="a" to="/fallback" href="https://example.com">
            Link
          </Button>
        );
        const link = screen.getByRole('link') as HTMLAnchorElement;
        expect(link.href).toBe('https://example.com/');
      });

      it('supports target prop', () => {
        render(
          <Button as="a" href="https://example.com" target="_blank">
            External
          </Button>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('target', '_blank');
      });

      it('supports rel prop', () => {
        render(
          <Button as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
            External
          </Button>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });

      it('applies button classes to anchor', () => {
        render(
          <Button as="a" href="https://example.com">
            Link
          </Button>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
      });

      it('supports variant on anchor', () => {
        render(
          <Button as="a" href="https://example.com" variant="success">
            Link
          </Button>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveClass('bg-[var(--color-status-success)]');
      });

      it('supports size on anchor', () => {
        render(
          <Button as="a" href="https://example.com" size="sm">
            Link
          </Button>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveClass('px-3', 'py-1.5', 'text-sm');
      });

      it('shows loading state on anchor', () => {
        const { container } = render(
          <Button as="a" href="https://example.com" isLoading>
            Loading
          </Button>
        );
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });

      it('shows spinner without margin on anchor when no text', () => {
        const { container } = render(<Button as="a" href="https://example.com" isLoading />);
        const svg = container.querySelector('svg');
        expect(svg).not.toHaveClass('mr-2');
      });

      it('renders left icon on anchor', () => {
        render(
          <Button as="a" href="https://example.com" leftIcon={<span>Icon</span>}>
            Text
          </Button>
        );
        const icon = screen.getByText('Icon');
        expect(icon).toBeInTheDocument();
      });

      it('renders right icon on anchor', () => {
        render(
          <Button as="a" href="https://example.com" rightIcon={<span>Icon</span>}>
            Text
          </Button>
        );
        const icon = screen.getByText('Icon');
        expect(icon).toBeInTheDocument();
      });

      it('applies left icon margin on anchor when there is text', () => {
        render(
          <Button as="a" href="https://example.com" leftIcon={<span>LeftIcon</span>}>
            Text
          </Button>
        );
        const iconSpan = screen.getByText('LeftIcon').parentElement;
        expect(iconSpan).toHaveClass('mr-1.5', '-ml-0.5');
      });

      it('does not apply left icon margin on anchor when no text', () => {
        render(<Button as="a" href="https://example.com" leftIcon={<span>LeftIcon</span>} />);
        const iconSpan = screen.getByText('LeftIcon').parentElement;
        expect(iconSpan).not.toHaveClass('mr-1.5');
      });

      it('applies right icon margin on anchor when there is text', () => {
        render(
          <Button as="a" href="https://example.com" rightIcon={<span>RightIcon</span>}>
            Text
          </Button>
        );
        const iconSpan = screen.getByText('RightIcon').parentElement;
        expect(iconSpan).toHaveClass('ml-1.5', '-mr-0.5');
      });

      it('does not apply right icon margin on anchor when no text', () => {
        render(<Button as="a" href="https://example.com" rightIcon={<span>RightIcon</span>} />);
        const iconSpan = screen.getByText('RightIcon').parentElement;
        expect(iconSpan).not.toHaveClass('ml-1.5');
      });

      it('handles onClick on anchor', () => {
        const onClick = vi.fn();
        render(
          <Button as="a" href="https://example.com" onClick={onClick}>
            Link
          </Button>
        );
        const link = screen.getByRole('link');
        fireEvent.click(link);
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default classes', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'inline-flex', 'items-center');
    });
  });

  describe('Full width button', () => {
    it('supports full width via className', () => {
      render(<Button className="w-full">Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Focus and accessibility', () => {
    it('has focus ring classes for keyboard navigation', () => {
      render(<Button>Focus</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
    });

    it('has gap between icon and text', () => {
      render(<Button leftIcon={<span>Icon</span>}>Text</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gap-1.5');
    });
  });

  describe('Shadow and transitions', () => {
    it('has shadow by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('shadow-sm');
    });

    it('has transition classes', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors', 'duration-150');
    });
  });

  describe('Spinner rendering', () => {
    it('renders SVG spinner when loading', () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('h-4', 'w-4', 'animate-spin');
    });

    it('spinner has correct viewBox', () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('spinner has animation class', () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });
  });

  describe('Edge cases', () => {
    it('renders without children', () => {
      render(<Button />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders with only icon and no text', () => {
      render(<Button leftIcon={<span>Icon</span>} />);
      const icon = screen.getByText('Icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders with multiple icon elements', () => {
      render(
        <Button
          leftIcon={
            <>
              <span>Icon1</span>
              <span>Icon2</span>
            </>
          }
        >
          Text
        </Button>
      );
      expect(screen.getByText('Icon1')).toBeInTheDocument();
      expect(screen.getByText('Icon2')).toBeInTheDocument();
    });

    it('renders with complex children', () => {
      render(
        <Button>
          <span>Part 1</span>
          <span>Part 2</span>
        </Button>
      );
      expect(screen.getByText('Part 1')).toBeInTheDocument();
      expect(screen.getByText('Part 2')).toBeInTheDocument();
    });

    it('handles rapid clicks', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('maintains state through prop updates', () => {
      const { rerender } = render(<Button variant="primary">Button</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('bg-[var(--color-interactive-default)]');

      rerender(<Button variant="danger">Button</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('bg-[var(--color-status-error)]');
    });
  });

  describe('Integration tests', () => {
    it('works with multiple buttons in a form', () => {
      render(
        <>
          <Button type="submit">Submit</Button>
          <Button type="reset">Reset</Button>
        </>
      );
      expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('type', 'submit');
      expect(screen.getByRole('button', { name: /reset/i })).toHaveAttribute('type', 'reset');
    });

    it('combines variant, size, loading, and icons', () => {
      const { container } = render(
        <Button variant="danger" size="lg" isLoading leftIcon={<span>Icon</span>}>
          Delete
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-[var(--color-status-error)]', 'px-6', 'py-3');
      expect(button).toBeDisabled();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies all base classes to every variant', () => {
      const variants = [
        'primary',
        'secondary',
        'danger',
        'warning',
        'success',
        'outline',
        'ghost',
      ] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
        unmount();
      });
    });
  });
});
