/**
 * @fileoverview Tests for AggregateRating component
 * Tests rating display, user interaction, async operations, and error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AggregateRating, RatingAPI } from './AggregateRating';

// Mock rating API factory
const createMockRatingAPI = (overrides?: Partial<RatingAPI>): RatingAPI => ({
  getRatingStats: vi.fn().mockResolvedValue({ average_rating: 4.2, total_ratings: 10 }),
  submitRating: vi.fn().mockResolvedValue({
    success: true,
    stats: { average_rating: 4.3, total_ratings: 11 },
  }),
  getUserRating: vi.fn().mockResolvedValue(null),
  ...overrides,
});

describe('AggregateRating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading state initially', () => {
      const mockAPI = createMockRatingAPI();
      const { unmount } = render(
        <AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />
      );

      expect(screen.getByText('Loading ratings...')).toBeInTheDocument();

      // Clean up before async operations complete to avoid act() warnings
      unmount();
    });

    it('shows 5 skeleton stars while loading', () => {
      const mockAPI = createMockRatingAPI();
      const { unmount } = render(
        <AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />
      );

      const skeletonContainer = screen.getByText('Loading ratings...').previousElementSibling;
      expect(skeletonContainer?.children).toHaveLength(5);

      // Clean up before async operations complete to avoid act() warnings
      unmount();
    });
  });

  describe('Data Fetching', () => {
    it('fetches rating stats on mount', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-item" itemType="case" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(mockAPI.getRatingStats).toHaveBeenCalledWith('test-item', 'case');
      });
    });

    it('fetches user rating on mount', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-item" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(mockAPI.getUserRating).toHaveBeenCalledWith('test-item', 'blog');
      });
    });

    it('displays average rating after loading', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('4.2')).toBeInTheDocument();
      });
    });

    it('displays total ratings count', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('(10 ratings)')).toBeInTheDocument();
      });
    });

    it('shows singular "rating" for single rating', async () => {
      const mockAPI = createMockRatingAPI({
        getRatingStats: vi.fn().mockResolvedValue({ average_rating: 5.0, total_ratings: 1 }),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('(1 rating)')).toBeInTheDocument();
      });
    });
  });

  describe('No Ratings State', () => {
    it('shows prompt to be first to rate when no ratings exist', async () => {
      const mockAPI = createMockRatingAPI({
        getRatingStats: vi.fn().mockResolvedValue({ average_rating: 0, total_ratings: 0 }),
      });
      render(<AggregateRating itemId="test-1" itemType="case" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('Be the first to rate this case!')).toBeInTheDocument();
      });
    });

    it('shows prompt for blog type', async () => {
      const mockAPI = createMockRatingAPI({
        getRatingStats: vi.fn().mockResolvedValue({ average_rating: 0, total_ratings: 0 }),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('Be the first to rate this blog!')).toBeInTheDocument();
      });
    });
  });

  describe('User Interaction', () => {
    it('renders 5 clickable star buttons', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button', { name: /Rate \d stars/i });
      expect(buttons).toHaveLength(5);
    });

    it('submits rating when star is clicked', async () => {
      const user = userEvent.setup();
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const fourthStar = screen.getByLabelText('Rate 4 stars');
      await user.click(fourthStar);

      expect(mockAPI.submitRating).toHaveBeenCalledWith('test-1', 'blog', 4);
    });

    it('shows saving status while submitting', async () => {
      const user = userEvent.setup();
      const mockAPI = createMockRatingAPI({
        submitRating: vi
          .fn()
          .mockImplementation(
            () =>
              new Promise((resolve) =>
                setTimeout(
                  () =>
                    resolve({ success: true, stats: { average_rating: 4.0, total_ratings: 1 } }),
                  100
                )
              )
          ),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const thirdStar = screen.getByLabelText('Rate 3 stars');
      await user.click(thirdStar);

      expect(screen.getByText('Saving…')).toBeInTheDocument();
    });

    it('shows success message after rating submission', async () => {
      const user = userEvent.setup();
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const fifthStar = screen.getByLabelText('Rate 5 stars');
      await user.click(fifthStar);

      await waitFor(() => {
        expect(screen.getByText('Thanks for rating!')).toBeInTheDocument();
      });
    });

    it('calls onRate callback after successful submission', async () => {
      const user = userEvent.setup();
      const onRate = vi.fn();
      const mockAPI = createMockRatingAPI();
      render(
        <AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} onRate={onRate} />
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const fourthStar = screen.getByLabelText('Rate 4 stars');
      await user.click(fourthStar);

      await waitFor(() => {
        expect(onRate).toHaveBeenCalledWith(4, { average_rating: 4.3, total_ratings: 11 });
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error message when submission fails with null response', async () => {
      const user = userEvent.setup();
      const mockAPI = createMockRatingAPI({
        submitRating: vi.fn().mockResolvedValue(null),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const thirdStar = screen.getByLabelText('Rate 3 stars');
      await user.click(thirdStar);

      await waitFor(() => {
        expect(screen.getByText('Could not save. Please try again.')).toBeInTheDocument();
      });
    });

    it('shows error message when submission fails with success=false', async () => {
      const user = userEvent.setup();
      const mockAPI = createMockRatingAPI({
        submitRating: vi.fn().mockResolvedValue({ success: false, stats: null }),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const thirdStar = screen.getByLabelText('Rate 3 stars');
      await user.click(thirdStar);

      await waitFor(() => {
        expect(screen.getByText('Could not save. Please try again.')).toBeInTheDocument();
      });
    });

    it('shows error message when submission throws', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockAPI = createMockRatingAPI({
        submitRating: vi.fn().mockRejectedValue(new Error('Network error')),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const thirdStar = screen.getByLabelText('Rate 3 stars');
      await user.click(thirdStar);

      await waitFor(() => {
        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('handles fetch errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockAPI = createMockRatingAPI({
        getRatingStats: vi.fn().mockRejectedValue(new Error('Network error')),
        getUserRating: vi.fn().mockRejectedValue(new Error('Network error')),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      // Should not crash, loading should complete
      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Existing User Rating', () => {
    it('displays user rating section title when user has rated', async () => {
      const mockAPI = createMockRatingAPI({
        getUserRating: vi.fn().mockResolvedValue(4),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('Your rating')).toBeInTheDocument();
      });
    });

    it('shows user rating feedback text', async () => {
      const mockAPI = createMockRatingAPI({
        getUserRating: vi.fn().mockResolvedValue(3),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('You rated this 3 stars')).toBeInTheDocument();
      });
    });

    it('shows singular "star" for 1-star rating', async () => {
      const mockAPI = createMockRatingAPI({
        getUserRating: vi.fn().mockResolvedValue(1),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('You rated this 1 star')).toBeInTheDocument();
      });
    });

    it('shows "Rate this blog" when user has not rated', async () => {
      const mockAPI = createMockRatingAPI({
        getUserRating: vi.fn().mockResolvedValue(null),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('Rate this blog')).toBeInTheDocument();
      });
    });

    it('shows "Rate this case" for case type', async () => {
      const mockAPI = createMockRatingAPI({
        getUserRating: vi.fn().mockResolvedValue(null),
      });
      render(<AggregateRating itemId="test-1" itemType="case" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.getByText('Rate this case')).toBeInTheDocument();
      });
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} size="sm" />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('w-4', 'h-4');
    });

    it('renders with medium size by default', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('w-6', 'h-6');
    });

    it('renders with large size', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} size="lg" />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('w-8', 'h-8');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for each star button', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByLabelText(`Rate ${i} stars`)).toBeInTheDocument();
      }
    });

    it('disables star buttons while submitting', async () => {
      const user = userEvent.setup();
      const mockAPI = createMockRatingAPI({
        submitRating: vi
          .fn()
          .mockImplementation(
            () =>
              new Promise((resolve) =>
                setTimeout(
                  () =>
                    resolve({ success: true, stats: { average_rating: 4.0, total_ratings: 1 } }),
                  200
                )
              )
          ),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const firstStar = screen.getByLabelText('Rate 1 stars');
      await user.click(firstStar);

      // All buttons should be disabled during submission
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('has aria-live region for star buttons', async () => {
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const starContainer = screen.getByLabelText('Rate 1 stars').parentElement;
      expect(starContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('uses role="status" for success message', async () => {
      const user = userEvent.setup();
      const mockAPI = createMockRatingAPI();
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const star = screen.getByLabelText('Rate 4 stars');
      await user.click(star);

      await waitFor(() => {
        const statusMessage = screen.getByRole('status');
        expect(statusMessage).toHaveTextContent('Thanks for rating!');
      });
    });

    it('uses role="alert" for error messages', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockAPI = createMockRatingAPI({
        submitRating: vi.fn().mockRejectedValue(new Error('Network error')),
      });
      render(<AggregateRating itemId="test-1" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading ratings...')).not.toBeInTheDocument();
      });

      const star = screen.getByLabelText('Rate 3 stars');
      await user.click(star);

      await waitFor(() => {
        const alertMessage = screen.getByRole('alert');
        expect(alertMessage).toHaveTextContent('Something went wrong.');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Re-fetching on itemId change', () => {
    it('refetches data when itemId changes', async () => {
      const mockAPI = createMockRatingAPI();
      const { rerender } = render(
        <AggregateRating itemId="item-1" itemType="blog" ratingAPI={mockAPI} />
      );

      await waitFor(() => {
        expect(mockAPI.getRatingStats).toHaveBeenCalledWith('item-1', 'blog');
      });

      rerender(<AggregateRating itemId="item-2" itemType="blog" ratingAPI={mockAPI} />);

      await waitFor(() => {
        expect(mockAPI.getRatingStats).toHaveBeenCalledWith('item-2', 'blog');
      });
    });
  });
});
