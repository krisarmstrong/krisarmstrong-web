import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
import {
  AggregateRating,
  LoadingPage,
  ErrorPage,
  ContentCard,
} from '@krisarmstrong/web-foundation';
import {
  getBlogPostBySlug,
  type BlogPost as BlogPostType,
  getRatingStats,
  submitRating,
  getUserRating,
  getAllBlogPosts,
} from '../lib/supabase';
import { shareToPlatform } from '../lib/share';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Blog post ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedPost = await getBlogPostBySlug(id);

        if (!fetchedPost) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }

        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Load related posts once the main post is available
  useEffect(() => {
    const loadRelated = async () => {
      if (!post?.tags?.length) return;
      const all = await getAllBlogPosts();
      const filtered = all
        .filter((p) => p.slug !== post.slug)
        .filter((p) => p.tags?.some((tag) => post.tags.includes(tag)))
        .slice(0, 3);
      setRelatedPosts(filtered);
    };
    void loadRelated();
  }, [post]);

  const metaReadTime = useMemo(() => post?.read_time ?? 5, [post]);

  if (loading) {
    return <LoadingPage message="Loading blog post..." variant="violet" />;
  }

  if (error || !post) {
    return (
      <ErrorPage
        error={error || 'Blog post not found'}
        onRetry={() => window.location.reload()}
        variant="violet"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <nav className="text-sm text-text-muted flex items-center gap-2">
        <Link
          to="/"
          className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded"
        >
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to="/blog"
          className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded"
        >
          Blog
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary font-semibold line-clamp-1">{post.title}</span>
      </nav>
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-text-accent hover:text-interactive-hover transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded px-1 py-0.5"
        >
          ← Back to Blog
        </Link>
      </div>

      <article className="bg-gradient-to-b from-violet-950/40 via-surface-raised to-surface-raised rounded-3xl border border-surface-border shadow-xl overflow-hidden">
        <header className="mb-6 md:mb-8 px-6 md:px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span aria-hidden="true">•</span>
            <span>{metaReadTime} min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tags=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full text-sm border border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 transition-colors focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                aria-label={`View posts tagged ${tag}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="prose dark:prose-invert prose-violet prose-lg max-w-none bg-surface-raised p-6 md:p-8 rounded-2xl shadow-inner shadow-violet-500/5 mx-6 md:mx-8 mb-8 [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:mb-6 [&_ol]:mb-6 [&_li]:mb-2">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-4 mb-10 px-6 md:px-8 pb-8">
          <div className="grid gap-6 md:grid-cols-2 bg-surface-raised border border-surface-border rounded-2xl p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Share
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { platform: 'linkedin', icon: <Linkedin size={18} />, label: 'LinkedIn' },
                  { platform: 'twitter', icon: <Twitter size={18} />, label: 'Twitter' },
                  { platform: 'facebook', icon: <Facebook size={18} />, label: 'Facebook' },
                ].map(({ platform, icon, label }) => (
                  <button
                    key={platform}
                    onClick={() =>
                      shareToPlatform(
                        platform as 'linkedin' | 'twitter' | 'facebook',
                        post,
                        window.location.href,
                        console.warn
                      )
                    }
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-border text-text-primary bg-surface-hover hover:bg-violet-500/10 hover:border-violet-400 transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:-translate-y-0.5 shadow-sm"
                    aria-label={`Share on ${label}`}
                    title={`Share on ${label}`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Rate this post
              </h3>
              <AggregateRating
                itemId={post.slug}
                itemType="blog"
                ratingAPI={{
                  getRatingStats,
                  submitRating,
                  getUserRating,
                }}
                starColor="violet-400"
                size="md"
                onRate={(rating, stats) => {
                  console.warn(
                    `User rated post ${post.slug}: ${rating} stars. New average: ${stats.average_rating}`
                  );
                }}
              />
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className="px-6 md:px-8 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">More like this</h2>
              <Link
                to="/blog"
                className="text-sm text-violet-300 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded px-2 py-1"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((p, idx) => (
                <ContentCard
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  title={p.title}
                  excerpt={p.excerpt}
                  date={p.date}
                  tags={p.tags || []}
                  readTime={p.read_time || 5}
                  accentColor="violet"
                  animationDelay={idx * 60}
                  onTagClick={(tag) => navigate(`/blog?tags=${encodeURIComponent(tag)}`)}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
