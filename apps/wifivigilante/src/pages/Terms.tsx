// src/pages/Terms.tsx
import { ShieldCheck } from "lucide-react";
import { H1, P, MutedText } from '../components/ui/Typography.jsx';

export default function Terms(): React.ReactElement {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <H1 icon={<ShieldCheck size={32} className="text-brand-primary" />}>Terms of Service</H1>
        </header>
        <article className="bg-surface-raised border border-surface-border rounded-xl shadow-xl p-6 sm:p-8 space-y-4">
          <P>
            Welcome to Wi-Fi Vigilante ("Site"). By accessing or using our Site, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to all of these Terms, do not use this Site.
          </P>
          <P>
            The content provided on this Site, including all case studies, articles, and diagnostic information, is for educational and informational purposes only. It is not intended as, and should not be understood or construed as, professional advice. Your use of any information provided on this site is solely at your own risk.
          </P>
          <P>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. We will indicate the date of the last revision at the bottom of this page. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
          </P>
          <MutedText className="mt-6 pt-4 border-t border-surface-border">Last updated: May 28, 2025</MutedText>
        </article>
      </div>
    </div>
  );
}
