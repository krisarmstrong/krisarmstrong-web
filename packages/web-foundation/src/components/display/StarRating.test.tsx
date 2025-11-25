/**
 * @fileoverview Tests for StarRating component
 * Tests rating display, user interaction, and localStorage persistence
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders 5 star buttons', () => {
      render(<StarRating itemId="test-1" />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });

    it('shows "Click to rate" when no user rating', () => {
      render(<StarRating itemId="test-1" />);
      expect(screen.getByText(/Click to rate/i)).toBeInTheDocument();
    });

    it('does not show average rating when totalRatings is 0', () => {
      render(<StarRating itemId="test-1" />);
      expect(screen.queryByText(/Average:/i)).not.toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('updates rating when star is clicked', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-2" />);

      const fourthStar = screen.getAllByRole('button')[3];
      await user.click(fourthStar);

      expect(screen.getByText(/You rated: 4\/5/i)).toBeInTheDocument();
    });

    it('calls onRate callback when rating is selected', async () => {
      const user = userEvent.setup();
      const onRate = vi.fn();

      render(<StarRating itemId="test-3" onRate={onRate} />);

      const thirdStar = screen.getAllByRole('button')[2];
      await user.click(thirdStar);

      expect(onRate).toHaveBeenCalledWith(3);
    });

    it('allows changing an existing rating', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-4" />);

      // Rate 4 stars
      const fourthStar = screen.getAllByRole('button')[3];
      await user.click(fourthStar);
      expect(screen.getByText(/You rated: 4\/5/i)).toBeInTheDocument();

      // Change to 2 stars
      const secondStar = screen.getAllByRole('button')[1];
      await user.click(secondStar);
      expect(screen.getByText(/You rated: 2\/5/i)).toBeInTheDocument();
    });
  });

  describe('LocalStorage Persistence', () => {
    it('persists rating to localStorage', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-5" />);

      const fifthStar = screen.getAllByRole('button')[4];
      await user.click(fifthStar);

      const storedRating = localStorage.getItem('content-user-rating-test-5');
      expect(storedRating).toBe('5');
    });

    it('loads rating from localStorage on mount', () => {
      localStorage.setItem('content-user-rating-test-6', '4');

      render(<StarRating itemId="test-6" />);

      expect(screen.getByText(/You rated: 4\/5/i)).toBeInTheDocument();
    });

    it('updates average rating after submission', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-7" />);

      const fourthStar = screen.getAllByRole('button')[3];
      await user.click(fourthStar);

      // Check that average was updated
      const averageText = screen.getByText(/Average:/);
      expect(averageText.textContent).toContain('4.0');
    });

    it('handles localStorage errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock localStorage.getItem to throw error
      vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage unavailable');
      });

      // Should not crash
      render(<StarRating itemId="test-8" />);
      expect(screen.getAllByRole('button')).toHaveLength(5);

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Rating Stats', () => {
    it('shows average rating after a rating is submitted', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-9" />);

      const fourthStar = screen.getAllByRole('button')[3];
      await user.click(fourthStar);

      // After rating, average should be displayed
      expect(screen.getByText(/Average: 4\.0\/5/i)).toBeInTheDocument();
      expect(screen.getByText(/\(1 rating\)/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for each star', () => {
      render(<StarRating itemId="test-10" />);

      for (let i = 1; i <= 5; i++) {
        const star = screen.getByLabelText(`Rate ${i} stars`);
        expect(star).toBeInTheDocument();
      }
    });

    it('shows visual feedback for filled stars', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-11" />);

      const thirdStar = screen.getAllByRole('button')[2];
      await user.click(thirdStar);

      // User rating should be displayed
      expect(screen.getByText(/You rated: 3\/5/i)).toBeInTheDocument();
    });
  });

  describe('Rating Display', () => {
    it('shows instruction text when no ratings exist', () => {
      render(<StarRating itemId="test-12" />);
      expect(screen.getByText(/Click to rate/i)).toBeInTheDocument();
    });

    it('shows rating count after rating', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-13" />);

      const secondStar = screen.getAllByRole('button')[1];
      await user.click(secondStar);

      expect(screen.getByText(/\(1 rating\)/i)).toBeInTheDocument();
    });

    it('hides instruction text after user rates', async () => {
      const user = userEvent.setup();
      render(<StarRating itemId="test-14" />);

      expect(screen.getByText(/Click to rate/i)).toBeInTheDocument();

      const firstStar = screen.getAllByRole('button')[0];
      await user.click(firstStar);

      expect(screen.queryByText(/Click to rate/i)).not.toBeInTheDocument();
    });
  });
});
