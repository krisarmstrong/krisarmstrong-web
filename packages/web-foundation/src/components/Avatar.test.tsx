import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders the avatar with initials when no src is provided', () => {
    render(<Avatar initials="KA" />);
    const initials = screen.getByText(/ka/i);
    expect(initials).toBeInTheDocument();
  });

  it('renders the avatar with an image when src is provided', () => {
    render(<Avatar src="test.jpg" alt="Profile" />);
    const image = screen.getByRole('img', { name: /profile/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test.jpg');
  });
});
