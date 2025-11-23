// src/pages/Privacy.tsx
import { Lock } from 'lucide-react';
import { H1, P, MutedText } from '../components/ui/Typography.jsx';

export default function Privacy(): React.ReactElement {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <H1 icon={<Lock size={32} className="text-brand-primary" />}>Privacy Policy</H1>
        </header>
        <article className="bg-surface-raised border border-surface-border rounded-xl shadow-xl p-6 sm:p-8 space-y-4">
          <P>
            We collect minimal data (e.g., browser type, page views through simple analytics) to
            understand site usage and improve our content. We do not sell or share your personal
            information with third parties for their marketing purposes. Essential cookies may be
            used for site functionality.
          </P>
          <P>
            You can typically manage cookie preferences and opt-out of analytics tracking via your
            browser settings or by using browser extensions designed for privacy. For any questions
            regarding your data or this policy, please contact us at{' '}
            <a
              href="mailto:privacy@wifi-vigilante.com"
              className="text-brand-primary hover:text-brand-primary-hover underline"
            >
              privacy@wifi-vigilante.com
            </a>
            .
          </P>
          <MutedText className="mt-6 pt-4 border-t border-surface-border">
            Last updated: May 28, 2025
          </MutedText>
        </article>
      </div>
    </div>
  );
}
