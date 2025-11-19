import { render, screen } from '@testing-library/react';
import { Card, CardContent } from './Card';

describe('Card', () => {
  it('renders the card with its content', () => {
    render(
      <Card>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );
    const cardContent = screen.getByText(/card content/i);
    expect(cardContent).toBeInTheDocument();
  });
});
