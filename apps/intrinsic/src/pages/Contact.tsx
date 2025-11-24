export default function Contact() {
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
          <form className="space-y-6">
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
                required
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors"
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
                required
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors"
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
                required
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors"
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
                required
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors"
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
                required
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors"
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
                required
                className="w-full px-4 py-3 border-2 border-surface-border rounded-lg bg-surface-raised focus:border-brand-accent focus:ring-0 outline-none transition-colors resize-none"
                placeholder="Tell me about your goals and what you're looking to achieve..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-brand-accent text-text-inverse font-semibold py-4 rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg shadow-lg"
              >
                Send Message
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
