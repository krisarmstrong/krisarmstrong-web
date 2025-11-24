import { FormEvent, ReactNode, useId, useState, useOptimistic, startTransition } from 'react';
import { Button } from './ui/Button';

const toneStyles = {
  violet: {
    focus: 'focus:ring-violet-500 focus:border-violet-400',
    link: 'text-violet-300 hover:text-violet-200',
  },
  blue: {
    focus: 'focus:ring-blue-500 focus:border-blue-400',
    link: 'text-blue-300 hover:text-blue-200',
  },
  emerald: {
    focus: 'focus:ring-emerald-500 focus:border-emerald-400',
    link: 'text-emerald-300 hover:text-emerald-200',
  },
  sage: {
    focus: 'focus:ring-emerald-500 focus:border-emerald-400',
    link: 'text-emerald-300 hover:text-emerald-200',
  },
} as const;

const surfaces = {
  dark: {
    card: 'bg-gray-900 border border-gray-800 text-gray-100 shadow-2xl shadow-black/40',
    label: 'text-gray-300',
    helper: 'text-gray-400',
    input: 'bg-gray-800 border-gray-700 text-white placeholder-gray-500',
    offline: 'border-amber-400/60 bg-amber-900/20 text-amber-100',
    offlineText: 'text-amber-100/80',
    success: 'bg-gray-800 border border-gray-700 text-gray-100',
    error: 'text-rose-300',
  },
  light: {
    card: 'bg-white border border-gray-200 text-gray-900 shadow-xl shadow-gray-600/10',
    label: 'text-gray-700',
    helper: 'text-gray-500',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    offline: 'border-amber-200 bg-amber-50 text-amber-800',
    offlineText: 'text-amber-700',
    success: 'bg-gray-50 border border-gray-200 text-gray-800',
    error: 'text-rose-500',
  },
} as const;

export type ContactFormTone = keyof typeof toneStyles;
export type ContactFormSurface = keyof typeof surfaces;

export interface ContactFormProps {
  endpoint?: string;
  tone?: ContactFormTone;
  background?: ContactFormSurface;
  title?: string;
  description?: string;
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
  offlineTitle?: string;
  offlineMessage?: string;
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  privacyNotice?: string;
  footer?: ReactNode;
  className?: string;
  cardClassName?: string;
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
  telemetry?: {
    enabled: boolean;
  };
}

export function ContactForm({
  endpoint,
  tone = 'violet',
  background = 'dark',
  title,
  description,
  submitLabel = 'Send message',
  successTitle = 'Thank you!',
  successMessage = "Your message is in my queue. I'll respond soon.",
  offlineTitle = 'Contact form offline',
  offlineMessage = 'The form endpoint is not configured. Reach out via email or LinkedIn while we fix this.',
  nameLabel = 'Name',
  emailLabel = 'Email',
  messageLabel = 'Message',
  namePlaceholder = 'Your name',
  emailPlaceholder = 'you@example.com',
  messagePlaceholder = 'How can I help?',
  privacyNotice = 'By submitting, you agree to our privacy policy.',
  footer,
  className = '',
  cardClassName = '',
  onSubmitSuccess,
  onSubmitError,
}: ContactFormProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const honeypotId = useId();

  // React 19: Optimistic UI - show success immediately while request processes
  const [optimisticSent, setOptimisticSent] = useOptimistic(
    sent,
    (_currentState, optimisticValue: boolean) => optimisticValue
  );

  const palette = toneStyles[tone];
  const surface = surfaces[background];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!endpoint) {
      setError('Contact endpoint is not configured.');
      return;
    }

    if (honeypot.trim().length > 0) {
      // Honeypot detected - likely spam
      setSent(true);
      setError(null);
      event.currentTarget.reset();
      return;
    }

    startTransition(() => {
      setSubmitting(true);
      setError(null);
    });

    // React 19: Show optimistic success immediately for instant feedback
    startTransition(() => {
      setOptimisticSent(true);
    });

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      event.currentTarget.reset();
      startTransition(() => {
        setSent(true);
      });
      onSubmitSuccess?.();
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error('Failed to submit contact form');
      startTransition(() => {
        setError("We couldn't send your message. Please try again or email me directly.");
      });
      onSubmitError?.(errorObject);
    } finally {
      startTransition(() => {
        setSubmitting(false);
      });
    }
  };

  return (
    <section className={`space-y-6 ${className}`}>
      {(title || description) && (
        <header className="space-y-2 text-center">
          {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
          {description && <p className={`text-base ${surface.helper}`}>{description}</p>}
        </header>
      )}

      {!endpoint && (
        <div className={`rounded-lg px-4 py-3 text-sm ${surface.offline}`}>
          <p className="font-semibold">{offlineTitle}</p>
          <p className={`mt-1 ${surface.offlineText}`}>{offlineMessage}</p>
        </div>
      )}

      {optimisticSent ? (
        <div className={`rounded-2xl px-6 py-10 text-center ${surface.success}`} aria-live="polite">
          <h3 className="text-2xl font-semibold mb-2">{successTitle}</h3>
          <p className="text-base opacity-90">{successMessage}</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className={`space-y-6 rounded-2xl px-6 py-8 ${surface.card} ${cardClassName}`}
        >
          <div className="sr-only" aria-hidden="true">
            <label htmlFor={honeypotId}>Company</label>
            <input
              id={honeypotId}
              name="company"
              type="text"
              autoComplete="off"
              tabIndex={-1}
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-semibold ${surface.label}`}
              htmlFor="contact-name"
            >
              {nameLabel}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder={namePlaceholder}
              className={`w-full rounded-lg border-2 px-4 py-3 transition ${surface.input} ${palette.focus}`}
            />
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-semibold ${surface.label}`}
              htmlFor="contact-email"
            >
              {emailLabel}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder={emailPlaceholder}
              className={`w-full rounded-lg border-2 px-4 py-3 transition ${surface.input} ${palette.focus}`}
            />
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-semibold ${surface.label}`}
              htmlFor="contact-message"
            >
              {messageLabel}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              placeholder={messagePlaceholder}
              className={`min-h-[140px] w-full resize-y rounded-lg border-2 px-4 py-3 transition ${surface.input} ${palette.focus}`}
            />
          </div>

          <Button
            type="submit"
            tone={tone === 'sage' ? 'sage' : tone}
            className="w-full justify-center text-lg"
            isLoading={submitting}
            disabled={submitting || !endpoint}
            aria-label={submitLabel}
          >
            {submitLabel}
          </Button>

          {privacyNotice && <p className={`text-xs ${surface.helper}`}>{privacyNotice}</p>}

          {error && (
            <p className={`text-sm ${surface.error}`} role="alert">
              {error}
            </p>
          )}
        </form>
      )}

      {footer && <div className={`text-center text-sm ${surface.helper}`}>{footer}</div>}
    </section>
  );
}
