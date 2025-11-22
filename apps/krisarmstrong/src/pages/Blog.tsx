import { motion } from "framer-motion";
import {
  LoadingPage,
  ErrorPage,
  ContentSearch,
  ContentSort,
  ActiveFilterBadges,
  LoadMoreButton,
  EmptyState,
  useProgressiveLoad,
  type ActiveFilter
} from '@krisarmstrong/web-foundation';
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBlogPosts, type BlogPost } from "../lib/supabase";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);

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
      if (sortBy === "popular") {
        return (b.view_count || 0) - (a.view_count || 0);
      }

      // Sort by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [blogPosts, sortBy]);

  // Use search results if searching, otherwise use sorted posts
  const postsToFilter = searchResults.length > 0 || blogPosts.length === 0 ? searchResults : sortedPosts;

  // Filter by tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return postsToFilter;
    return postsToFilter.filter(post => post.tags?.includes(selectedTag));
  }, [postsToFilter, selectedTag]);

  // Progressive loading
  const { visibleItems: visiblePosts, remainingCount, loadMore, hasMore } = useProgressiveLoad(
    filteredPosts,
    { itemsPerLoad: 12, initialCount: 12 }
  );

  // Active filters for badge display
  const activeFilters: ActiveFilter[] = selectedTag
    ? [{ id: 'tag', value: selectedTag, onRemove: () => setSelectedTag(null) }]
    : [];

  // Loading state
  if (loading) {
    return <LoadingPage message="Loading blog posts..." variant="violet" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorPage
        error={error}
        onRetry={() => window.location.reload()}
        variant="violet"
      />
    );
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
          Case studies, deep dives, and lessons learned from 20+ years in network engineering and cybersecurity.
        </p>

        {/* Search */}
        <ContentSearch
          items={sortedPosts}
          onSearch={setSearchResults}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-raised p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-surface-border hover:border-brand-accent/50"
            >
              {post.featured && (
                <span className="inline-block px-3 py-1 bg-brand-accent/20 text-text-accent text-xs rounded-full mb-3">
                  Featured
                </span>
              )}
              <Link to={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold text-text-primary mb-3 hover:text-text-accent transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-text-muted text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>{post.read_time || 5} min read</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(tag);
                      }}
                      className="bg-surface-hover text-text-primary text-xs px-2 py-1 rounded-full hover:bg-brand-accent/20 hover:text-text-accent transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
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
            action={selectedTag ? {
              label: 'Clear Filters',
              onClick: () => setSelectedTag(null)
            } : undefined}
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
