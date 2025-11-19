export default function PrivacyPolicy() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-text-muted">
          <p className="text-sm text-text-subtle">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Introduction</h2>
            <p>
              Intrinsic Momentum Mindset ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Information We Collect</h2>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fill out a contact form</li>
              <li>Subscribe to our newsletter</li>
              <li>Book a consultation</li>
              <li>Communicate with us via email or phone</li>
            </ul>
            <p className="mt-4">This information may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Date of birth</li>
              <li>Gender</li>
              <li>Any other information you choose to provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to your inquiries and provide customer service</li>
              <li>Send you information about our services</li>
              <li>Process your consultation bookings</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@intrinsicmomentummindset.com" className="text-text-accent hover:underline">
                privacy@intrinsicmomentummindset.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
