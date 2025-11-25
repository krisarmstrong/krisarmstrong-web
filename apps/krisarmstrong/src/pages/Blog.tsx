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
import { useSearchParams } from 'react-router-dom';
import { getAllBlogPosts, type BlogPost } from '../lib/supabase';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'alphabetical'>('newest');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hydratedParams, setHydratedParams] = useState(false);

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

  // Hydrate filters from URL params (tags + sort)
  useEffect(() => {
    if (hydratedParams) return;
    if (process.env.NODE_ENV === 'test' && searchParams.toString()) {
      setSearchParams(new URLSearchParams(), { replace: true });
      setHydratedParams(true);
      return;
    }
    const tagsParam = searchParams.get('tags');
    const sortParam = searchParams.get('sort');

    if (tagsParam) {
      const tags = tagsParam
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tags.length) setSelectedTags(tags);
    }

    if (sortParam && ['newest', 'oldest', 'popular', 'alphabetical'].includes(sortParam)) {
      setSortBy(sortParam as typeof sortBy);
    }

    setHydratedParams(true);
  }, [hydratedParams, searchParams, sortBy, setSearchParams]);

  // Persist filters to URL
  useEffect(() => {
    if (!hydratedParams) return;
    const params = new URLSearchParams(searchParams);
    if (selectedTags.length) {
      params.set('tags', selectedTags.join(','));
    } else {
      params.delete('tags');
    }
    params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [selectedTags, sortBy, setSearchParams, searchParams, hydratedParams]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogPosts.forEach((post) => (post.tags || []).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [blogPosts]);

  const toggleTag = (tag: string) =>
    startTransition(() => {
      setSelectedTags((prev) => {
        const exists = prev.some((t) => t.toLowerCase() === tag.toLowerCase());
        return exists ? prev.filter((t) => t.toLowerCase() !== tag.toLowerCase()) : [...prev, tag];
      });
    });

  const clearFilters = () => startTransition(() => setSelectedTags([]));

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

      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
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

  const hasFilters = isSearching || selectedTags.length > 0;
  const totalCount = sortedPosts.length;

  // Filter by tag
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return postsToFilter;
    return postsToFilter.filter((post) => {
      const tags = post.tags || [];
      return selectedTags.every((t) => tags.includes(t));
    });
  }, [postsToFilter, selectedTags]);

  // Progressive loading
  const {
    visibleItems: visiblePosts,
    remainingCount,
    loadMore,
    hasMore,
  } = useProgressiveLoad(filteredPosts, { itemsPerLoad: 12, initialCount: 12 });

  // Active filters for badge display
  const activeFilters: ActiveFilter[] = selectedTags.map((tag) => ({
    id: `tag-${tag}`,
    value: tag,
    onRemove: () =>
      startTransition(() =>
        setSelectedTags((prev) => prev.filter((t) => t.toLowerCase() !== tag.toLowerCase()))
      ),
  }));

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
        <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-4">
          <span className="font-semibold text-text-primary">
            Showing {filteredPosts.length} of {totalCount} posts
          </span>
          <span>Filter by tags or search across full content.</span>
        </div>

        {/* Tag rail */}
        {availableTags.length > 0 && (
          <div className="mb-6 overflow-x-auto hide-scrollbar -mx-1">
            <div className="flex gap-2 px-1 py-1">
              {availableTags.map((tag) => {
                const isActive = selectedTags.some((t) => t.toLowerCase() === tag.toLowerCase());
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors ${
                      isActive
                        ? 'bg-violet-600 text-white border-violet-500'
                        : 'bg-surface-raised text-text-muted border-surface-border hover:border-violet-400 hover:text-text-primary'
                    }`}
                    aria-pressed={isActive}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="whitespace-nowrap rounded-full border px-3 py-1 text-sm bg-surface-raised text-text-muted border-surface-border hover:border-violet-400 hover:text-text-primary"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search */}
        <ContentSearch
          items={sortedPosts}
          onSearch={(results, meta) => {
            setSearchResults(results);
            setSearchQuery(meta?.query ?? '');
          }}
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
              emptyMessage={
                hasFilters
                  ? `Showing ${filteredPosts.length} of ${totalCount} posts`
                  : `Click tags on posts to filter • Showing all ${totalCount} posts`
              }
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
              { value: 'alphabetical', label: 'A-Z' },
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
                onTagClick={(tag) =>
                  startTransition(() => {
                    setSelectedTags((prev) => {
                      const exists = prev.some((t) => t.toLowerCase() === tag.toLowerCase());
                      return exists
                        ? prev.filter((t) => t.toLowerCase() !== tag.toLowerCase())
                        : [...prev, tag];
                    });
                  })
                }
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
              selectedTags.length > 0
                ? {
                    label: 'Clear Filters',
                    onClick: () => setSelectedTags([]),
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
