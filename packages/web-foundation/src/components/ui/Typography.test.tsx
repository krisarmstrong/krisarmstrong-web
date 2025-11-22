import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  H1,
  H2,
  P,
  SmallText,
  MutedText,
  AccentLink,
  ArticleTitle,
  Tag,
  Badge,
} from './Typography';

// Helper function to render with MemoryRouter (needed for AccentLink)
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Typography', () => {
  describe('H1 Component', () => {
    it('renders the H1 component with the correct text', () => {
      render(<H1>Heading 1</H1>);
      const heading = screen.getByRole('heading', { level: 1, name: /heading 1/i });
      expect(heading).toBeInTheDocument();
    });

    it('applies default text color class', () => {
      render(<H1>Heading 1</H1>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-text-primary');
    });

    it('applies custom accentColorClass', () => {
      render(<H1 accentColorClass="text-red-500">Heading 1</H1>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-red-500');
    });

    it('renders with custom className', () => {
      render(<H1 className="custom-class">Heading 1</H1>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('custom-class');
    });

    it('renders with icon', () => {
      render(
        <H1 icon={<span data-testid="test-icon">Icon</span>}>
          Heading 1
        </H1>
      );
      const icon = screen.getByTestId('test-icon');
      expect(icon).toBeInTheDocument();
    });

    it('applies correct base styles', () => {
      render(<H1>Heading 1</H1>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'font-extrabold', 'mb-6');
    });
  });

  describe('H2 Component', () => {
    it('renders the H2 component with the correct text', () => {
      render(<H2>Heading 2</H2>);
      const heading = screen.getByRole('heading', { level: 2, name: /heading 2/i });
      expect(heading).toBeInTheDocument();
    });

    it('applies default text color class', () => {
      render(<H2>Heading 2</H2>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-text-primary');
    });

    it('applies custom accentColorClass', () => {
      render(<H2 accentColorClass="text-blue-500">Heading 2</H2>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-blue-500');
    });

    it('renders with custom className', () => {
      render(<H2 className="custom-h2-class">Heading 2</H2>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('custom-h2-class');
    });

    it('renders with icon', () => {
      render(
        <H2 icon={<span data-testid="h2-icon">Icon</span>}>
          Heading 2
        </H2>
      );
      const icon = screen.getByTestId('h2-icon');
      expect(icon).toBeInTheDocument();
    });

    it('applies correct base styles', () => {
      render(<H2>Heading 2</H2>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mb-4');
    });
  });

  describe('P Component', () => {
    it('renders the P component with the correct text', () => {
      render(<P>Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toBeInTheDocument();
    });

    it('applies default color class (muted)', () => {
      render(<P>Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('text-text-muted');
    });

    it('applies primary color class when specified', () => {
      render(<P color="primary">Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('text-text-primary');
    });

    it('applies accent color class when specified', () => {
      render(<P color="accent">Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('text-text-accent');
    });

    it('applies default size (base)', () => {
      render(<P>Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('text-base');
    });

    it('applies small size when specified', () => {
      render(<P size="sm">Small paragraph</P>);
      const paragraph = screen.getByText(/small paragraph/i);
      expect(paragraph).toHaveClass('text-sm');
    });

    it('applies default leading (relaxed)', () => {
      render(<P>Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('leading-relaxed');
    });

    it('applies normal leading when specified', () => {
      render(<P leading="normal">Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('leading-normal');
    });

    it('applies loose leading when specified', () => {
      render(<P leading="loose">Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('leading-loose');
    });

    it('renders with custom className', () => {
      render(<P className="custom-p-class">Paragraph text</P>);
      const paragraph = screen.getByText(/paragraph text/i);
      expect(paragraph).toHaveClass('custom-p-class');
    });

    it('can render as different element using as prop', () => {
      render(
        <P as="div" data-testid="p-as-div">
          Paragraph as div
        </P>
      );
      const div = screen.getByTestId('p-as-div');
      expect(div.tagName).toBe('DIV');
    });

    it('combines multiple properties correctly', () => {
      render(
        <P color="primary" size="sm" leading="loose" className="extra-class">
          Styled paragraph
        </P>
      );
      const paragraph = screen.getByText(/styled paragraph/i);
      expect(paragraph).toHaveClass(
        'text-text-primary',
        'text-sm',
        'leading-loose',
        'extra-class'
      );
    });
  });

  describe('SmallText Component', () => {
    it('renders the SmallText component with the correct text', () => {
      render(<SmallText>Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toBeInTheDocument();
    });

    it('applies text-sm class by default', () => {
      render(<SmallText>Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('text-sm');
    });

    it('applies default color (muted)', () => {
      render(<SmallText>Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('text-text-muted');
    });

    it('applies primary color when specified', () => {
      render(<SmallText color="primary">Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('text-text-primary');
    });

    it('applies accent color when specified', () => {
      render(<SmallText color="accent">Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('text-text-accent');
    });

    it('applies default leading (normal)', () => {
      render(<SmallText>Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('leading-normal');
    });

    it('applies relaxed leading when specified', () => {
      render(<SmallText leading="relaxed">Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('leading-relaxed');
    });

    it('applies loose leading when specified', () => {
      render(<SmallText leading="loose">Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('leading-loose');
    });

    it('renders with custom className', () => {
      render(<SmallText className="custom-small-class">Small text</SmallText>);
      const smallText = screen.getByText(/small text/i);
      expect(smallText).toHaveClass('custom-small-class');
    });
  });

  describe('MutedText Component', () => {
    it('renders the MutedText component with the correct text', () => {
      render(<MutedText>Muted text</MutedText>);
      const mutedText = screen.getByText(/muted text/i);
      expect(mutedText).toBeInTheDocument();
    });

    it('applies text-sm and text-text-muted classes', () => {
      render(<MutedText>Muted text</MutedText>);
      const mutedText = screen.getByText(/muted text/i);
      expect(mutedText).toHaveClass('text-sm', 'text-text-muted');
    });

    it('renders with custom className', () => {
      render(<MutedText className="custom-muted-class">Muted text</MutedText>);
      const mutedText = screen.getByText(/muted text/i);
      expect(mutedText).toHaveClass('custom-muted-class');
    });
  });

  describe('ArticleTitle Component', () => {
    it('renders the ArticleTitle component with the correct text', () => {
      render(<ArticleTitle>Article Title</ArticleTitle>);
      const heading = screen.getByRole('heading', { level: 2, name: /article title/i });
      expect(heading).toBeInTheDocument();
    });

    it('applies correct base styles', () => {
      render(<ArticleTitle>Article Title</ArticleTitle>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass(
        'text-2xl',
        'lg:text-3xl',
        'font-bold',
        'text-text-primary',
        'mb-3'
      );
    });

    it('renders with custom className', () => {
      render(<ArticleTitle className="custom-article-class">Article Title</ArticleTitle>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('custom-article-class');
    });
  });

  describe('AccentLink Component', () => {
    it('renders the AccentLink component with the correct text and href', () => {
      renderWithRouter(
        <AccentLink to="/test">Click here</AccentLink>
      );
      const link = screen.getByRole('link', { name: /click here/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('applies correct base styles', () => {
      renderWithRouter(
        <AccentLink to="/test">Click here</AccentLink>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1.5',
        'transition-colors'
      );
    });

    it('renders with left icon', () => {
      renderWithRouter(
        <AccentLink to="/test" iconLeft={<span data-testid="left-icon">→</span>}>
          Click here
        </AccentLink>
      );
      const icon = screen.getByTestId('left-icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      renderWithRouter(
        <AccentLink to="/test" iconRight={<span data-testid="right-icon">→</span>}>
          Click here
        </AccentLink>
      );
      const icon = screen.getByTestId('right-icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders with both left and right icons', () => {
      renderWithRouter(
        <AccentLink
          to="/test"
          iconLeft={<span data-testid="left-icon">←</span>}
          iconRight={<span data-testid="right-icon">→</span>}
        >
          Click here
        </AccentLink>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderWithRouter(
        <AccentLink to="/test" className="custom-link-class">
          Click here
        </AccentLink>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link-class');
    });
  });

  describe('Tag Component', () => {
    it('renders the Tag component with the correct text', () => {
      render(<Tag>Tag text</Tag>);
      const tag = screen.getByText(/tag text/i);
      expect(tag).toBeInTheDocument();
    });

    it('applies primary color scheme by default', () => {
      const { container } = render(<Tag>Tag text</Tag>);
      const tag = container.querySelector('span');
      expect(tag).toHaveClass(
        'bg-[var(--color-brand-primary)]/20',
        'text-[var(--color-brand-primary)]',
        'border',
        'border-[var(--color-brand-primary)]/30'
      );
    });

    it('applies success color scheme', () => {
      const { container } = render(<Tag colorScheme="success">Success</Tag>);
      const tag = container.querySelector('span');
      expect(tag).toHaveClass(
        'bg-[var(--color-status-success)]/20',
        'text-[var(--color-status-success)]',
        'border-[var(--color-status-success)]/30'
      );
    });

    it('applies warning color scheme', () => {
      const { container } = render(<Tag colorScheme="warning">Warning</Tag>);
      const tag = container.querySelector('span');
      expect(tag).toHaveClass(
        'bg-[var(--color-status-warning)]/20',
        'text-[var(--color-status-warning)]',
        'border-[var(--color-status-warning)]/30'
      );
    });

    it('applies error color scheme', () => {
      const { container } = render(<Tag colorScheme="error">Error</Tag>);
      const tag = container.querySelector('span');
      expect(tag).toHaveClass(
        'bg-[var(--color-status-error)]/20',
        'text-[var(--color-status-error)]',
        'border-[var(--color-status-error)]/30'
      );
    });

    it('applies info color scheme', () => {
      const { container } = render(<Tag colorScheme="info">Info</Tag>);
      const tag = container.querySelector('span');
      expect(tag).toHaveClass(
        'bg-[var(--color-status-info)]/20',
        'text-[var(--color-status-info)]',
        'border-[var(--color-status-info)]/30'
      );
    });

    it('applies correct base styles', () => {
      const { container } = render(<Tag>Tag text</Tag>);
      const tag = container.querySelector('span');
      expect(tag).toHaveClass(
        'inline-flex',
        'items-center',
        'text-xs',
        'rounded-full',
        'font-medium',
        'px-2.5',
        'py-0.5'
      );
    });

    it('renders with custom className', () => {
      const { container } = render(
        <Tag className="custom-tag-class">Tag text</Tag>
      );
      const tag = container.querySelector('span');
      expect(tag).toHaveClass('custom-tag-class');
    });
  });

  describe('Badge Component', () => {
    it('renders the Badge component with the correct text', () => {
      render(<Badge>Badge text</Badge>);
      const badge = screen.getByText(/badge text/i);
      expect(badge).toBeInTheDocument();
    });

    it('applies default variant', () => {
      const { container } = render(<Badge>Badge text</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(
        'bg-[var(--color-brand-primary)]',
        'text-[var(--color-text-inverse)]'
      );
    });

    it('applies secondary variant', () => {
      const { container } = render(<Badge variant="secondary">Badge text</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(
        'bg-[var(--color-surface-raised)]',
        'text-[var(--color-text-primary)]',
        'border',
        'border-[var(--color-surface-border)]'
      );
    });

    it('applies success variant', () => {
      const { container } = render(<Badge variant="success">Success</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(
        'bg-[var(--color-status-success)]',
        'text-white'
      );
    });

    it('applies warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(
        'bg-[var(--color-status-warning)]',
        'text-[var(--color-text-primary)]'
      );
    });

    it('applies danger variant', () => {
      const { container } = render(<Badge variant="danger">Danger</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(
        'bg-[var(--color-status-error)]',
        'text-white'
      );
    });

    it('applies info variant', () => {
      const { container } = render(<Badge variant="info">Info</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(
        'bg-[var(--color-status-info)]',
        'text-white'
      );
    });

    it('applies correct base styles', () => {
      const { container } = render(<Badge>Badge text</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'text-xs',
        'font-semibold',
        'px-2.5',
        'py-0.5',
        'rounded-full'
      );
    });

    it('renders with custom className', () => {
      const { container } = render(
        <Badge className="custom-badge-class">Badge text</Badge>
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('custom-badge-class');
    });
  });

  describe('Custom className prop', () => {
    it('applies custom className to H1', () => {
      render(<H1 className="custom-h1">Test</H1>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('custom-h1');
    });

    it('applies custom className to H2', () => {
      render(<H2 className="custom-h2">Test</H2>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('custom-h2');
    });

    it('applies custom className to P', () => {
      render(<P className="custom-p">Test</P>);
      const paragraph = screen.getByText('Test');
      expect(paragraph).toHaveClass('custom-p');
    });

    it('applies custom className to SmallText', () => {
      render(<SmallText className="custom-small">Test</SmallText>);
      const text = screen.getByText('Test');
      expect(text).toHaveClass('custom-small');
    });

    it('applies custom className to MutedText', () => {
      render(<MutedText className="custom-muted">Test</MutedText>);
      const text = screen.getByText('Test');
      expect(text).toHaveClass('custom-muted');
    });

    it('applies custom className to ArticleTitle', () => {
      render(<ArticleTitle className="custom-article">Test</ArticleTitle>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('custom-article');
    });

    it('applies custom className to AccentLink', () => {
      renderWithRouter(
        <AccentLink to="/test" className="custom-link">Test</AccentLink>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link');
    });

    it('applies custom className to Tag', () => {
      const { container } = render(
        <Tag className="custom-tag">Test</Tag>
      );
      const tag = container.querySelector('span');
      expect(tag).toHaveClass('custom-tag');
    });

    it('applies custom className to Badge', () => {
      const { container } = render(
        <Badge className="custom-badge">Test</Badge>
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('custom-badge');
    });
  });
});
