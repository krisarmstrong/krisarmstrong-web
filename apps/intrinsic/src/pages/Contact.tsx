import { useState, type FormEvent } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
    if (!endpoint) {
      setStatus('error');
      setErrorMessage('Form endpoint not configured. Please contact us directly via email.');
      return;
    }

    const form = new window.FormData();
    form.append('fullName', formData.fullName);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('dob', formData.dob);
    form.append('gender', formData.gender);
    form.append('message', formData.message);

    fetch(endpoint, {
      method: 'POST',
      body: form,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setStatus('success');
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            message: '',
          });
        } else {
          return response.json().then((data: { error?: string }) => {
            setStatus('error');
            setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
          });
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMessage('Network error. Please check your connection and try again.');
      });
  };

  if (status === 'success') {
    return (
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-raised rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-brand-accent text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-heading text-text-primary mb-4">Message Sent!</h2>
            <p className="text-text-muted mb-8">
              Thank you for reaching out. I'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="bg-brand-accent text-text-inverse font-semibold py-3 px-8 rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading mb-6">
            Let's <span className="text-text-accent">Connect</span>
          </h1>
          <p className="text-xl text-text-muted">
            Ready to begin your transformation? Fill out the form below and I'll get back to you
            within 24 hours.
          </p>
          <div className="accent-divider mt-8" aria-hidden="true" />
        </div>

        <div className="bg-surface-raised rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-brand-accent">
          {status === 'error' && (
            <div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors disabled:opacity-50"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-text-primary mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors disabled:opacity-50"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-text-primary mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors disabled:opacity-50"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-Binary</option>
                <option value="prefer-not-to-say">Prefer Not to Say</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors resize-none disabled:opacity-50"
                placeholder="Tell me about your goals and what you're looking to achieve..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-brand-accent text-text-inverse font-semibold py-4 rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>

            <p className="text-sm text-text-muted text-center">
              By submitting this form, you agree to our Privacy Policy and Terms of Service.
            </p>
          </form>
        </div>

        {/* Alternative Contact */}
        <div className="mt-12 text-center">
          <p className="text-text-muted mb-4">Prefer to email directly?</p>
          <a
            href="mailto:contact@intrinsicmomentummindset.com"
            className="text-text-accent font-semibold hover:underline"
          >
            contact@intrinsicmomentummindset.com
          </a>
        </div>
      </div>
    </div>
  );
}
