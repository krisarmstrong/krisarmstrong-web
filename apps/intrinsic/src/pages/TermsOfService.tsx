export default function TermsOfService() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-text-muted">
          <p className="text-sm text-text-subtle">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Agreement to Terms</h2>
            <p>
              By accessing or using the Intrinsic Momentum Mindset website and services, you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Services</h2>
            <p>
              Intrinsic Momentum Mindset provides life coaching, leadership coaching, and related professional development services. Our services are intended for informational and educational purposes and are not a substitute for professional medical, psychological, or psychiatric advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Client Responsibilities</h2>
            <p>As a client, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Attend scheduled sessions on time</li>
              <li>Engage in good faith with the coaching process</li>
              <li>Take responsibility for your own decisions and actions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Confidentiality</h2>
            <p>
              All information shared during coaching sessions is confidential and will not be disclosed to third parties except as required by law or with your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Payment Terms</h2>
            <p>
              Payment for coaching services is due as agreed upon in your coaching agreement. Cancellations must be made at least 24 hours in advance to avoid charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Limitation of Liability</h2>
            <p>
              Coaching services are provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Termination</h2>
            <p>
              Either party may terminate the coaching relationship at any time with written notice. Refunds, if applicable, will be determined on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-primary-dark mt-8 mb-4">Contact Us</h2>
            <p>
              Questions about these Terms? Contact us at:
              <br />
              <a href="mailto:legal@intrinsicmomentummindset.com" className="text-text-accent hover:underline">
                legal@intrinsicmomentummindset.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
