import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavCard } from './NavCard';
import { Star } from 'lucide-react';

describe('NavCard', () => {
  it('renders the nav card with title, description, and icon', () => {
    render(
      <MemoryRouter>
        <NavCard to="/test" title="Test Card" description="This is a test card" icon={<Star />} />
      </MemoryRouter>
    );

    const title = screen.getByRole('heading', { name: /test card/i });
    expect(title).toBeInTheDocument();

    const description = screen.getByText(/this is a test card/i);
    expect(description).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });
});
