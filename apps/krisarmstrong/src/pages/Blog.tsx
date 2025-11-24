import { motion } from 'framer-motion';
import {
  LoadingPage,
  ErrorPage,
  ContentSearch,
  ContentSort,
  ActiveFilterBadges,
  LoadMoreButton,
  EmptyState,
  ContentCard,
  useProgressiveLoad,
  type ActiveFilter,
} from '@krisarmstrong/web-foundation';
import { useState, useMemo, useEffect, useTransition } from 'react';
import { getAllBlogPosts, type BlogPost } from '../lib/supabase';

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // React 19: Show pending state during tag filtering
  const [isPending, startTransition] = useTransition();

  // Fetch blog posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const posts = await getAllBlogPosts();
        setBlogPosts(posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Sort posts with featured always at the top
  const sortedPosts = useMemo(() => {
    const posts = [...blogPosts];
    return posts.sort((a, b) => {
      // Featured posts always come first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then sort by selected criteria
      if (sortBy === 'popular') {
        return (b.view_count || 0) - (a.view_count || 0);
      }

      // Sort by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [blogPosts, sortBy]);

  // Use search results if searching, otherwise use sorted posts
  const isSearching = searchQuery.trim().length > 0;
  const postsToFilter = isSearching ? searchResults : sortedPosts;

  // Filter by tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return postsToFilter;
    return postsToFilter.filter((post) => post.tags?.includes(selectedTag));
  }, [postsToFilter, selectedTag]);

  // Progressive loading
  const {
    visibleItems: visiblePosts,
    remainingCount,
    loadMore,
    hasMore,
  } = useProgressiveLoad(filteredPosts, { itemsPerLoad: 12, initialCount: 12 });

  // Active filters for badge display
  const activeFilters: ActiveFilter[] = selectedTag
    ? [
        {
          id: 'tag',
          value: selectedTag,
          onRemove: () => startTransition(() => setSelectedTag(null)),
        },
      ]
    : [];

  // Loading state
  if (loading) {
    return <LoadingPage message="Loading blog posts..." variant="violet" />;
  }

  // Error state
  if (error) {
    return <ErrorPage error={error} onRetry={() => window.location.reload()} variant="violet" />;
  }

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-3">Technical Blog</h1>
        <p className="text-text-muted mb-8">
          Case studies, deep dives, and lessons learned from 20+ years in network engineering and
          cybersecurity.
        </p>

        {/* Search */}
        <ContentSearch
          items={sortedPosts}
          onSearch={setSearchResults}
          onQueryChange={setSearchQuery}
          searchFields={['title', 'excerpt', 'content', 'tags']}
          placeholder="Search blog posts..."
          accentColor="violet"
          showResultCount
          className="mb-6"
        />

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
          {/* Active Filter Display */}
          <div className="flex-1">
            <ActiveFilterBadges
              filters={activeFilters}
              resultCount={filteredPosts.length}
              resultLabel="posts"
              accentColor="violet"
              emptyMessage={`Click tags on posts to filter • Showing all ${blogPosts.length} posts`}
            />
          </div>

          {/* Sort */}
          <ContentSort
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'popular', label: 'Most Popular' },
            ]}
            accentColor="violet"
          />
        </div>

        {/* Blog Posts Grid - 3 columns on desktop */}
        <div
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}
        >
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ContentCard
                href={`/blog/${post.slug}`}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                readTime={post.read_time || 5}
                tags={post.tags || []}
                onTagClick={(tag) => startTransition(() => setSelectedTag(tag))}
                featured={post.featured}
                accentColor="violet"
                animationDelay={index * 100}
              />
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <LoadMoreButton
            remainingCount={remainingCount}
            itemsPerLoad={12}
            onLoadMore={loadMore}
            itemLabel="posts"
            accentColor="violet"
            variant="primary"
          />
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <EmptyState
            title="No posts found"
            description="Try selecting a different tag or clearing filters"
            action={
              selectedTag
                ? {
                    label: 'Clear Filters',
                    onClick: () => setSelectedTag(null),
                  }
                : undefined
            }
            accentColor="violet"
          />
        )}

        {/* All Loaded Message */}
        {!hasMore && filteredPosts.length > 12 && (
          <div className="text-center py-8 text-text-muted">
            <p className="text-sm">✓ All posts loaded ({filteredPosts.length} total)</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
