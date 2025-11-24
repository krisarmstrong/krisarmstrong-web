export type SharePlatform = 'linkedin' | 'twitter' | 'facebook';

export function shareToPlatform(
  platform: SharePlatform,
  post: { title: string; slug: string },
  url: string,
  logger: (msg: string) => void = () => {}
) {
  const text = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(url);

  let target = '';
  switch (platform) {
    case 'linkedin':
      target = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
      break;
    case 'twitter':
      target = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`;
      break;
    case 'facebook':
      target = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      break;
    default:
      return;
  }

  window.open(target, '_blank', 'noopener,noreferrer');
  logger(`Shared ${post.slug} to ${platform}`);
}
