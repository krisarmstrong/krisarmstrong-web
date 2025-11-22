import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
        Terms of Service
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
            <h2 className="text-2xl font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this portfolio website, you accept and agree to be bound by the terms and
              provisions of this agreement. If you do not agree to these terms, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">2. Use License</h2>
            <p>
              Permission is granted to temporarily view the materials (information or software) on this website
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
              of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on this website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">3. Disclaimer</h2>
            <p>
              The materials on this website are provided on an 'as is' basis. Kris Armstrong makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">4. Limitations</h2>
            <p>
              In no event shall Kris Armstrong or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on this website could include technical, typographical, or photographic errors.
              Kris Armstrong does not warrant that any of the materials on its website are accurate, complete, or current.
              Kris Armstrong may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">6. Links</h2>
            <p>
              Kris Armstrong has not reviewed all of the sites linked to its website and is not responsible for the
              contents of any such linked site. The inclusion of any link does not imply endorsement by Kris Armstrong
              of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">7. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, images, and software,
              is the property of Kris Armstrong or its content suppliers and is protected by United States and
              international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">8. Modifications</h2>
            <p>
              Kris Armstrong may revise these Terms of Service at any time without notice. By using this website,
              you are agreeing to be bound by the then-current version of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">9. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the United States
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us through the contact form
              on this website.
            </p>
          </section>
        </div>
      </motion.div>
    </section>
  );
}
