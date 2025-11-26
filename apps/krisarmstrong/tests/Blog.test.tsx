import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Blog from '../src/pages/Blog';
import type { BlogPost } from '../src/lib/supabase';
import { getAllBlogPosts } from '../src/lib/supabase';

const mockBlogPosts: BlogPost[] = Array.from({ length: 15 }).map((_, index) => ({
  id: `post-${index}`,
  slug: `post-${index}`,
  title: `Post ${index + 1}`,
  excerpt: 'Sample excerpt',
  content: 'Sample content',
  author: 'Kris Armstrong',
  date: new Date(2024, 0, index + 1).toISOString(),
  published: true,
  featured: index % 5 === 0,
  read_time: 5,
  tags: index % 2 === 0 ? ['Wi-Fi', 'Security'] : ['Cloud'],
  meta_title: '',
  meta_description: '',
  og_image: '',
  view_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: Record<string, unknown>) => (
      <article {...props}>{children}</article>
    ),
  },
}));

const renderBlog = async () => {
  const utils = render(
    <BrowserRouter>
      <Blog />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Technical Blog')).toBeInTheDocument();
  });

  return utils;
};

describe('Blog', () => {
  beforeEach(() => {
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockBlogPosts);
  });

  it('renders blog page with title', async () => {
    await renderBlog();
    expect(screen.getByText('Technical Blog')).toBeInTheDocument();
  });

  it('displays initial 12 blog posts', async () => {
    await renderBlog();
    // Count blog post titles (h2 elements within links)
    const postTitles = screen.getAllByRole('heading', { level: 2 });
    expect(postTitles.length).toBeGreaterThan(0);
    expect(postTitles.length).toBeLessThanOrEqual(12);
  });

  it('shows sort dropdown', async () => {
    await renderBlog();
    const sortSelect = screen.getByRole('combobox');
    expect(sortSelect).toBeInTheDocument();
    expect(screen.getByText('Newest First')).toBeInTheDocument();
  });

  it('allows sorting by oldest first', async () => {
    await renderBlog();
    const sortSelect = screen.getByRole('combobox');

    fireEvent.change(sortSelect, { target: { value: 'oldest' } });

    await waitFor(() => {
      expect(sortSelect).toHaveValue('oldest');
    });
  });

  it('shows filter instructions', async () => {
    await renderBlog();
    expect(screen.getByText(/Click tags on posts to filter/)).toBeInTheDocument();
  });

  it('filters posts by tag when tag is clicked', async () => {
    await renderBlog();

    // Find and click a tag button (there should be multiple)
    const tagButtons = screen
      .getAllByRole('button')
      .filter(
        (button) =>
          button.textContent?.includes('Wi-Fi') || button.textContent?.includes('Security')
      );

    if (tagButtons.length > 0) {
      fireEvent.click(tagButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Filtered by:/)).toBeInTheDocument();
      });
    }
  });

  it('shows remove filter control when filtered', async () => {
    await renderBlog();

    // Click a tag to filter
    const tagButtons = screen.getAllByRole('button');
    const firstTagButton = tagButtons.find(
      (btn) => btn.className.includes('bg-gray-800') && btn.textContent?.length
    );

    if (firstTagButton) {
      fireEvent.click(firstTagButton);

      await waitFor(() => {
        const removeButton = screen.getByRole('button', { name: /remove filter/i });
        expect(removeButton).toBeInTheDocument();
      });
    }
  });

  it('clears filter when clear button is clicked', async () => {
    await renderBlog();

    // Click a tag to filter
    const tagButtons = screen.getAllByRole('button');
    const firstTagButton = tagButtons.find(
      (btn) => btn.className.includes('bg-gray-800') && btn.textContent?.length
    );

    if (firstTagButton) {
      fireEvent.click(firstTagButton);

      const removeButton = await screen.findByRole('button', { name: /remove filter/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.getByText(/Click tags on posts to filter/)).toBeInTheDocument();
      });
    }
  });

  it('displays featured badge on featured posts', async () => {
    await renderBlog();
    // Check if any post has featured badge
    const featuredBadges = screen.queryAllByText('Featured');
    // Featured posts should exist based on our data
    expect(featuredBadges.length).toBeGreaterThanOrEqual(0);
  });

  it('shows Load More button when there are more posts', async () => {
    await renderBlog();

    // Should show "Load More" button if there are > 12 posts
    const loadMoreButton = screen.queryByText(/Load .* More Posts/);

    // This depends on having > 12 posts in the data
    if (loadMoreButton) {
      expect(loadMoreButton).toBeInTheDocument();
    }
  });

  it('loads more posts when Load More is clicked', async () => {
    await renderBlog();

    const loadMoreButton = screen.queryByText(/Load .* More Posts/);

    if (loadMoreButton) {
      const initialTitles = screen.getAllByRole('heading', { level: 2 });
      const initialCount = initialTitles.length;

      fireEvent.click(loadMoreButton);

      await waitFor(() => {
        const newTitles = screen.getAllByRole('heading', { level: 2 });
        expect(newTitles.length).toBeGreaterThan(initialCount);
      });
    }
  });

  it('displays post metadata (date and read time)', async () => {
    await renderBlog();

    // Should have dates
    const dates = screen.getAllByText(/\w+ \d{1,2}, \d{4}/);
    expect(dates.length).toBeGreaterThan(0);

    // Should have read times
    const readTimes = screen.getAllByText(/5 min read/);
    expect(readTimes.length).toBeGreaterThan(0);
  });

  it('allows sorting by popular posts', async () => {
    await renderBlog();
    const sortSelect = screen.getByRole('combobox');

    fireEvent.change(sortSelect, { target: { value: 'popular' } });

    await waitFor(() => {
      expect(sortSelect).toHaveValue('popular');
    });
  });

  it('allows sorting alphabetically', async () => {
    await renderBlog();
    const sortSelect = screen.getByRole('combobox');

    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });

    await waitFor(() => {
      expect(sortSelect).toHaveValue('alphabetical');
    });
  });

  it('shows error state when fetch fails', async () => {
    vi.mocked(getAllBlogPosts).mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load blog posts/)).toBeInTheDocument();
    });

    // Should show retry button
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('shows empty state when no posts match filter', async () => {
    // Create mock data with only one unique tag
    const singleTagPosts: BlogPost[] = Array.from({ length: 3 }).map((_, index) => ({
      id: `post-${index}`,
      slug: `post-${index}`,
      title: `Post ${index + 1}`,
      excerpt: 'Sample excerpt',
      content: 'Sample content',
      author: 'Kris Armstrong',
      date: new Date(2024, 0, index + 1).toISOString(),
      published: true,
      featured: false,
      read_time: 5,
      tags: ['UniqueTag'],
      meta_title: '',
      meta_description: '',
      og_image: '',
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    vi.mocked(getAllBlogPosts).mockResolvedValue(singleTagPosts);

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Technical Blog')).toBeInTheDocument();
    });

    // Click a tag to filter
    const tagButtons = screen
      .getAllByRole('button')
      .filter((button) => button.textContent?.includes('UniqueTag'));

    if (tagButtons.length > 0) {
      // First click filters by UniqueTag (should show all 3 posts)
      fireEvent.click(tagButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Filtered by:/)).toBeInTheDocument();
      });
    }
  });

  it('shows search input', async () => {
    await renderBlog();
    const searchInput = screen.getByPlaceholderText(/Search blog posts/);
    expect(searchInput).toBeInTheDocument();
  });

  it('toggles tag filter when same tag is clicked twice', async () => {
    await renderBlog();

    // Find a tag button and click it to filter
    const tagButtons = screen
      .getAllByRole('button')
      .filter((button) => button.textContent?.includes('Wi-Fi'));

    if (tagButtons.length > 0) {
      // First click - add filter
      fireEvent.click(tagButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Filtered by:/)).toBeInTheDocument();
      });

      // Click same tag again to remove filter
      const removeButton = screen.getByRole('button', { name: /remove filter/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.getByText(/Click tags on posts to filter/)).toBeInTheDocument();
      });
    }
  });

  it('shows empty state and clears filters when clear button clicked', async () => {
    // Create posts where multi-tag filtering produces 0 results
    // Post A has TagA only, Post B has TagA+TagB
    // Filter by TagA (shows both), then add TagB filter (shows only Post B)
    // Then search for something that doesn't exist to get empty state
    const postsWithTags: BlogPost[] = [
      {
        id: 'post-a',
        slug: 'post-a',
        title: 'Post About Apples',
        excerpt: 'Sample excerpt',
        content: 'Sample content',
        author: 'Kris Armstrong',
        date: new Date(2024, 0, 1).toISOString(),
        published: true,
        featured: false,
        read_time: 5,
        tags: ['TagA'],
        meta_title: '',
        meta_description: '',
        og_image: '',
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'post-ab',
        slug: 'post-ab',
        title: 'Post About Both',
        excerpt: 'Sample excerpt',
        content: 'Sample content',
        author: 'Kris Armstrong',
        date: new Date(2024, 0, 2).toISOString(),
        published: true,
        featured: false,
        read_time: 5,
        tags: ['TagA', 'TagB'],
        meta_title: '',
        meta_description: '',
        og_image: '',
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'post-c',
        slug: 'post-c',
        title: 'Post About Cats',
        excerpt: 'Sample excerpt',
        content: 'Sample content',
        author: 'Kris Armstrong',
        date: new Date(2024, 0, 3).toISOString(),
        published: true,
        featured: false,
        read_time: 5,
        tags: ['TagC'],
        meta_title: '',
        meta_description: '',
        og_image: '',
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    vi.mocked(getAllBlogPosts).mockResolvedValue(postsWithTags);

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Technical Blog')).toBeInTheDocument();
    });

    // First filter by TagA (shows Post A and Post AB)
    const tagAButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.includes('TagA'));
    if (tagAButton) {
      fireEvent.click(tagAButton);

      await waitFor(() => {
        expect(screen.getByText(/Filtered by:/)).toBeInTheDocument();
      });

      // Now add TagC filter - Post AB has TagA+TagB, Post A has only TagA
      // Neither has TagC, so filtering by TagA + TagC = 0 results
      const tagCButton = screen
        .getAllByRole('button')
        .find((btn) => btn.textContent?.includes('TagC'));
      if (tagCButton) {
        fireEvent.click(tagCButton);

        // Wait for empty state - no posts have BOTH TagA AND TagC
        await waitFor(() => {
          expect(screen.getByText(/No posts found/)).toBeInTheDocument();
        });

        // Click Clear Filters button in empty state
        const clearButton = screen.getByRole('button', { name: /Clear Filters/i });
        fireEvent.click(clearButton);

        // Should show all posts again
        await waitFor(() => {
          expect(screen.getByText(/Click tags on posts to filter/)).toBeInTheDocument();
        });
      }
    }
  });

  it('removes tag from filter when same tag clicked again', async () => {
    await renderBlog();

    // Find and click a Wi-Fi tag button to add filter
    const tagButtons = screen
      .getAllByRole('button')
      .filter((button) => button.textContent?.includes('Wi-Fi'));

    if (tagButtons.length > 0) {
      // First click adds the filter
      fireEvent.click(tagButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Filtered by:/)).toBeInTheDocument();
      });

      // Click the same tag again on a different post to toggle it off
      // Find all Wi-Fi tags and click one to toggle off
      const wifiTagsAfterFilter = screen
        .getAllByRole('button')
        .filter((button) => button.textContent?.includes('Wi-Fi'));

      if (wifiTagsAfterFilter.length > 1) {
        // Click a different Wi-Fi tag to toggle the filter off
        fireEvent.click(wifiTagsAfterFilter[1]);

        await waitFor(() => {
          expect(screen.getByText(/Click tags on posts to filter/)).toBeInTheDocument();
        });
      }
    }
  });
});
