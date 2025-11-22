import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-accent hover:text-interactive-hover transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Privacy Policy
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-invert max-w-none"
      >
        <p className="text-text-muted mb-6">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-6 text-text-primary">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">1. Information Collection</h2>
            <p>
              This portfolio website is informational in nature. We do not actively collect personal information
              unless you voluntarily provide it through the contact form or other means of communication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">2. Use of Information</h2>
            <p>
              Any information you provide (such as through the contact form) will be used solely for the purpose
              of responding to your inquiry and will not be shared with third parties without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">3. Cookies and Tracking</h2>
            <p>
              This website may use cookies to enhance user experience, such as remembering your dark mode preference.
              We do not use third-party tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">4. Third-Party Links</h2>
            <p>
              This website may contain links to external sites (GitHub, LinkedIn, Twitter, etc.). We are not
              responsible for the privacy practices of these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect any information you provide. However, no method
              of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">6. Your Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of any personal information
              you have provided. Please contact us using the information on the Contact page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">7. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page
              with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">8. Contact Information</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through the contact form on this website.
            </p>
          </section>
        </div>
      </motion.div>
    </section>
  );
}
