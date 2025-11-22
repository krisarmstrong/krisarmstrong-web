import { ContactForm } from "@krisarmstrong/web-foundation";

export default function Contact() {
  const formEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  return (
    <section className="max-w-2xl mx-auto py-12 px-4">
      <ContactForm
        endpoint={formEndpoint}
        tone="violet"
        background="dark"
        title="Let's build something resilient"
        description="Reach out for wireless consulting, executive advisory, or to say hello. I respond within one business day."
        privacyNotice="No spam, no newsletter lists—just a direct response from me."
        offlineTitle="Contact form offline"
        offlineMessage="The Formspree endpoint isn't configured. Ping me on LinkedIn while I get it sorted."
        footer={
          <p>
            Prefer a direct link? Connect on{' '}
            <a
              href="https://www.linkedin.com/in/kris-armstrong-cissp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent underline"
            >
              LinkedIn
            </a>
            {' '}or review my work on{' '}
            <a
              href="https://github.com/krisarmstrong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent underline"
            >
              GitHub
            </a>
            .
          </p>
        }
      />
    </section>
  );
}
