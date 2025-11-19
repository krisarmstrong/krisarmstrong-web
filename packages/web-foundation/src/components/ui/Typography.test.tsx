import { render, screen } from '@testing-library/react';
import { H1, P, MutedText } from './Typography';

describe('Typography', () => {
  it('renders the H1 component with the correct text', () => {
    render(<H1>Heading 1</H1>);
    const heading = screen.getByRole('heading', { level: 1, name: /heading 1/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the P component with the correct text', () => {
    render(<P>Paragraph text</P>);
    const paragraph = screen.getByText(/paragraph text/i);
    expect(paragraph).toBeInTheDocument();
  });

  it('renders the MutedText component with the correct text', () => {
    render(<MutedText>Muted text</MutedText>);
    const mutedText = screen.getByText(/muted text/i);
    expect(mutedText).toBeInTheDocument();
  });
});
