import { ContactForm } from '@krisarmstrong/web-foundation';
import { H1 } from '@krisarmstrong/web-foundation';
import { Mail } from 'lucide-react';

export default function Contact() {
  const formEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <H1 icon={<Mail size={32} className="text-brand-primary" />}>Contact</H1>
      </header>

      <section className="max-w-xl mx-auto">
        <ContactForm
          endpoint={formEndpoint}
          tone="emerald"
          background="dark"
          title="Let's troubleshoot your wireless blind spots"
          description="Share the symptoms—air-time contention, rogue APs, failed security audits—and I'll follow up with a triage plan within one business day."
          privacyNotice="No marketing drips. Your details go straight to me and stay in a secure vault."
          offlineTitle="Contact form offline"
          offlineMessage="The Formspree endpoint isn't configured. Ping me on LinkedIn while I get it patched."
          footer={
            <p>
              Prefer a direct channel? Message me on{' '}
              <a
                href="https://www.linkedin.com/in/kris-armstrong-cissp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline"
              >
                LinkedIn
              </a>{' '}
              or open an issue on{' '}
              <a
                href="https://github.com/krisarmstrong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline"
              >
                GitHub
              </a>
              .
            </p>
          }
        />
      </section>
    </div>
  );
}
