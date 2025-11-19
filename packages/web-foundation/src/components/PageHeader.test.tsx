import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import { Star } from 'lucide-react';

describe('PageHeader', () => {
  it('renders the page header with title and description', () => {
    render(<PageHeader icon={Star} title="Test Header" description="This is a test header" />);

    const title = screen.getByRole('heading', { name: /test header/i });
    expect(title).toBeInTheDocument();

    const description = screen.getByText(/this is a test header/i);
    expect(description).toBeInTheDocument();
  });
});
