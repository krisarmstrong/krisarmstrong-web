import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { ArrowLeft, Linkedin, Twitter, Facebook } from 'lucide-react';
import { AggregateRating, LoadingPage, ErrorPage } from '@krisarmstrong/web-foundation';
import {
  getBlogPostBySlug,
  type BlogPost as BlogPostType,
  getRatingStats,
  submitRating,
  getUserRating,
} from '../lib/supabase';
import { shareToPlatform } from '../lib/share';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-text-accent hover:text-interactive-hover mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-brand-accent/10 dark:bg-brand-accent/20 text-text-accent rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="prose dark:prose-invert prose-violet prose-lg max-w-none bg-surface-raised p-6 md:p-8 rounded-2xl shadow-lg [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:mb-6 [&_ol]:mb-6 [&_li]:mb-2">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
        </div>

        {/* Share + Rating Section */}
        <div className="mt-8 p-6 bg-surface-raised rounded-2xl border border-surface-border space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-text-muted">Share:</span>
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
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-border text-text-primary hover:bg-surface-hover transition-colors text-sm"
                aria-label={`Share on ${label}`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

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
      </article>
    </div>
  );
}
