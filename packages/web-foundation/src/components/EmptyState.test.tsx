import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';
import { vi } from 'vitest';

describe('EmptyState', () => {
  it('renders the empty state with title, description, and action', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <EmptyState
        title="No results"
        description="Try a different search"
        action={{ label: 'Clear search', onClick }}
      />
    );

    const title = screen.getByRole('heading', { name: /no results/i });
    expect(title).toBeInTheDocument();

    const description = screen.getByText(/try a different search/i);
    expect(description).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /clear search/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
