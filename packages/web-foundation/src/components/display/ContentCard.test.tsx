/**
 * @fileoverview Tests for ContentCard component
 * Tests rendering, variants, interactions, and accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ContentCard } from './ContentCard';

// Wrapper component for router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ContentCard', () => {
  const defaultProps = {
    href: '/test-link',
    title: 'Test Title',
    excerpt: 'This is a test excerpt for the content card component.',
  };

  describe('Basic Rendering', () => {
    it('renders title', () => {
      renderWithRouter(<ContentCard {...defaultProps} />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders excerpt', () => {
      renderWithRouter(<ContentCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.excerpt)).toBeInTheDocument();
    });

    it('renders link with correct href', () => {
      renderWithRouter(<ContentCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-link');
    });

    it('renders with custom className', () => {
      renderWithRouter(<ContentCard {...defaultProps} className="custom-class" />);
      const card = screen.getByRole('link');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Loading State', () => {
    it('shows loading skeleton when isLoading is true', () => {
      renderWithRouter(<ContentCard {...defaultProps} isLoading />);
      const loadingCard = screen.getByLabelText('Loading content card');
      expect(loadingCard).toBeInTheDocument();
      expect(loadingCard).toHaveAttribute('aria-busy', 'true');
    });

    it('does not render content when loading', () => {
      renderWithRouter(<ContentCard {...defaultProps} isLoading />);
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('shows image skeleton when loading with image', () => {
      renderWithRouter(<ContentCard {...defaultProps} isLoading image="/test.jpg" />);
      const loadingCard = screen.getByLabelText('Loading content card');
      const imageSkeletons = loadingCard.querySelectorAll('.animate-pulse');
      expect(imageSkeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Featured Badge', () => {
    it('shows featured badge when featured is true', () => {
      renderWithRouter(<ContentCard {...defaultProps} featured />);
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('does not show featured badge when featured is false', () => {
      renderWithRouter(<ContentCard {...defaultProps} featured={false} />);
      expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    });
  });

  describe('Date and Time Display', () => {
    it('formats and displays date', () => {
      renderWithRouter(<ContentCard {...defaultProps} date="2025-01-15T12:00:00" />);
      // Use regex to match the formatted date pattern (handles timezone differences)
      expect(screen.getByText(/January 1[45], 2025/)).toBeInTheDocument();
    });

    it('displays read time', () => {
      renderWithRouter(<ContentCard {...defaultProps} readTime={5} />);
      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('displays duration', () => {
      renderWithRouter(<ContentCard {...defaultProps} durationMinutes={10} />);
      expect(screen.getByText('10 min')).toBeInTheDocument();
    });

    it('displays multiple time elements', () => {
      renderWithRouter(
        <ContentCard
          {...defaultProps}
          date="2025-01-15T12:00:00"
          readTime={5}
          durationMinutes={10}
        />
      );
      expect(screen.getByText(/January 1[45], 2025/)).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText('10 min')).toBeInTheDocument();
    });
  });

  describe('Tags', () => {
    it('renders tags', () => {
      renderWithRouter(<ContentCard {...defaultProps} tags={['Wi-Fi 7', 'Networking']} />);
      expect(screen.getByText('Wi-Fi 7')).toBeInTheDocument();
      expect(screen.getByText('Networking')).toBeInTheDocument();
    });

    it('does not render tag section when tags array is empty', () => {
      renderWithRouter(<ContentCard {...defaultProps} tags={[]} />);
      expect(screen.queryByLabelText('Content tags')).not.toBeInTheDocument();
    });

    it('calls onTagClick when tag is clicked', async () => {
      const user = userEvent.setup();
      const onTagClick = vi.fn();
      renderWithRouter(
        <ContentCard {...defaultProps} tags={['Wi-Fi 7']} onTagClick={onTagClick} />
      );

      const tag = screen.getByText('Wi-Fi 7');
      await user.click(tag);

      expect(onTagClick).toHaveBeenCalledWith('Wi-Fi 7');
    });

    it('prevents event propagation when tag is clicked', async () => {
      const user = userEvent.setup();
      const onTagClick = vi.fn();
      renderWithRouter(
        <ContentCard {...defaultProps} tags={['Wi-Fi 7']} onTagClick={onTagClick} />
      );

      const tag = screen.getByText('Wi-Fi 7');
      await user.click(tag);

      // Tag click should work without navigating
      expect(onTagClick).toHaveBeenCalledTimes(1);
    });

    it('renders tags as non-interactive spans when no onTagClick provided', () => {
      renderWithRouter(<ContentCard {...defaultProps} tags={['Wi-Fi 7']} />);
      const tag = screen.getByText('Wi-Fi 7');
      // Tags without onTagClick should not have role="button"
      expect(tag).not.toHaveAttribute('role', 'button');
      expect(tag).not.toHaveAttribute('tabindex');
    });

    it('renders tags as interactive buttons when onTagClick is provided', () => {
      const onTagClick = vi.fn();
      renderWithRouter(
        <ContentCard {...defaultProps} tags={['Wi-Fi 7']} onTagClick={onTagClick} />
      );
      const tagButton = screen.getByRole('button', { name: /Wi-Fi 7/i });
      expect(tagButton).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Metadata', () => {
    it('displays metadata text', () => {
      renderWithRouter(<ContentCard {...defaultProps} metadata="Healthcare • Hospital" />);
      expect(screen.getByText('Healthcare • Hospital')).toBeInTheDocument();
    });

    it('renders metadata icon when provided', () => {
      const icon = <span data-testid="test-icon">Icon</span>;
      renderWithRouter(<ContentCard {...defaultProps} metadata="Test" metadataIcon={icon} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Severity', () => {
    const severities: Array<'Critical' | 'High' | 'Medium' | 'Low'> = [
      'Critical',
      'High',
      'Medium',
      'Low',
    ];

    severities.forEach((severity) => {
      it(`renders ${severity} severity badge`, () => {
        renderWithRouter(<ContentCard {...defaultProps} severity={severity} />);
        expect(screen.getByText(severity)).toBeInTheDocument();
      });
    });
  });

  describe('Status', () => {
    it('displays status badge', () => {
      renderWithRouter(<ContentCard {...defaultProps} status="Resolved" />);
      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });
  });

  describe('Image', () => {
    it('renders image when provided', () => {
      renderWithRouter(<ContentCard {...defaultProps} image="/test-image.jpg" />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('uses title as alt text when imageAlt not provided', () => {
      renderWithRouter(<ContentCard {...defaultProps} image="/test-image.jpg" />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test Title');
    });

    it('uses imageAlt when provided', () => {
      renderWithRouter(
        <ContentCard {...defaultProps} image="/test-image.jpg" imageAlt="Custom alt text" />
      );
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Custom alt text');
    });
  });

  describe('Progress Bar', () => {
    it('renders progress bar when progress > 0', () => {
      renderWithRouter(<ContentCard {...defaultProps} progress={50} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not render progress bar when progress is 0', () => {
      renderWithRouter(<ContentCard {...defaultProps} progress={0} />);
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('does not render progress bar when progress is undefined', () => {
      renderWithRouter(<ContentCard {...defaultProps} />);
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('has correct aria attributes on progress bar', () => {
      renderWithRouter(<ContentCard {...defaultProps} progress={75} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-label', 'Reading progress');
    });
  });

  describe('Variants', () => {
    it('applies default variant styles', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="default" />);
      const link = screen.getByRole('link');
      // Variant padding is on the first flex-grow div (main content area)
      const contentDiv = link.querySelector('.flex-grow');
      expect(contentDiv).toHaveClass('p-6');
    });

    it('applies compact variant styles', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="compact" />);
      const link = screen.getByRole('link');
      const contentDiv = link.querySelector('.flex-grow');
      expect(contentDiv).toHaveClass('p-4');
    });

    it('applies expanded variant styles', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="expanded" />);
      const link = screen.getByRole('link');
      const contentDiv = link.querySelector('.flex-grow');
      expect(contentDiv).toHaveClass('p-8');
    });
  });

  describe('Accent Colors', () => {
    const accentColors: Array<'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'teal'> = [
      'violet',
      'blue',
      'green',
      'red',
      'yellow',
      'teal',
    ];

    accentColors.forEach((color) => {
      it(`applies ${color} accent color classes`, () => {
        renderWithRouter(<ContentCard {...defaultProps} accentColor={color} />);
        const card = screen.getByRole('link');
        expect(card).toHaveClass(`hover:border-${color}-500/50`);
      });
    });
  });

  describe('Animation', () => {
    it('applies animation delay style', () => {
      renderWithRouter(<ContentCard {...defaultProps} animationDelay={100} />);
      const card = screen.getByRole('link');
      expect(card).toHaveStyle({ animationDelay: '100ms' });
    });

    it('defaults to 0ms animation delay', () => {
      renderWithRouter(<ContentCard {...defaultProps} />);
      const card = screen.getByRole('link');
      expect(card).toHaveStyle({ animationDelay: '0ms' });
    });
  });

  describe('Accessibility', () => {
    it('has accessible link', () => {
      renderWithRouter(<ContentCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('has focus-visible ring styles', () => {
      renderWithRouter(<ContentCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('focus-visible:ring-2');
    });

    it('tag section has aria-label', () => {
      renderWithRouter(<ContentCard {...defaultProps} tags={['Test']} />);
      expect(screen.getByLabelText('Content tags')).toBeInTheDocument();
    });

    it('interactive tags have role="button" and tabindex', () => {
      const onTagClick = vi.fn();
      renderWithRouter(<ContentCard {...defaultProps} tags={['Test']} onTagClick={onTagClick} />);
      const tagButton = screen.getByRole('button', { name: /Test/i });
      expect(tagButton).toHaveAttribute('role', 'button');
      expect(tagButton).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Title Styling by Variant', () => {
    it('uses text-xl for default variant', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="default" />);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-xl');
    });

    it('uses text-lg for compact variant', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="compact" />);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-lg');
    });

    it('uses text-2xl for expanded variant', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="expanded" />);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-2xl');
    });
  });

  describe('Excerpt Line Clamping', () => {
    it('uses line-clamp-3 for default variant', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="default" />);
      const excerpt = screen.getByText(defaultProps.excerpt);
      expect(excerpt).toHaveClass('line-clamp-3');
    });

    it('uses line-clamp-2 for compact variant', () => {
      renderWithRouter(<ContentCard {...defaultProps} variant="compact" />);
      const excerpt = screen.getByText(defaultProps.excerpt);
      expect(excerpt).toHaveClass('line-clamp-2');
    });
  });
});
