// src/utils/share.ts

import type { TransformedCase } from '@/types';

/**
 * Handles sharing a case to a specified social media platform or copies to clipboard.
 * @param platform - The platform to share to (e.g., 'linkedin', 'twitter', 'facebook', 'instagram').
 * @param caseData - The case data object, expected to have at least a 'title' and 'id'.
 * @param currentUrl - The current page URL to be shared.
 * @param alertFn - Optional alert function for notifications (defaults to window.alert).
 */
export function shareToPlatform(
  platform: string,
  caseData: TransformedCase,
  currentUrl: string,
  alertFn: (message: string) => void = alert
): void {
  if (!caseData) {
    alertFn("Case data is not available for sharing.");
    return;
  }

  const title = encodeURIComponent(caseData.title || "Wi-Fi Vigilante Case");
  const url = encodeURIComponent(currentUrl);
  let shareUrl: string | undefined;

  switch (platform.toLowerCase()) {
    case "linkedin":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
    case "twitter": // Or "x"
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
      break;
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case "instagram":
      // Instagram doesn't have a direct web share intent for posts with URLs.
      // Typically, apps guide users to copy a link and open Instagram.
      navigator.clipboard.writeText(`${caseData.title}\n${currentUrl}`)
        .then(() => alertFn("Instagram sharing not directly supported. Link copied to clipboard! You can paste it in your Instagram post."))
        .catch(err => {
          console.error("Failed to copy to clipboard for Instagram:", err);
          alertFn("Could not copy link to clipboard. Please copy it manually.");
        });
      return; // Exit early for Instagram
    default:
      console.warn(`Unknown sharing platform: ${platform}`);
      alertFn(`Sharing to ${platform} is not supported.`);
      return;
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
}
