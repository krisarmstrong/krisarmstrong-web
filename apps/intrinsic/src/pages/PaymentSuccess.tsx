/**
 * @fileoverview Payment success page shown after completing PayPal payment
 * @module pages/PaymentSuccess
 */

import { Link } from 'react-router-dom';
import { Button } from '@krisarmstrong/web-foundation';

/**
 * PaymentSuccess - Confirmation page after successful payment
 *
 * Shown when users return from PayPal after completing payment
 * Provides next steps and program information
 */
export default function PaymentSuccess() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-status-success/10 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-status-success"
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

          <h1 className="text-4xl md:text-5xl font-heading mb-4">
            Welcome to Your <span className="text-brand-accent">Transformation Journey</span>
          </h1>
          <p className="text-xl text-text-muted mb-8">
            Your payment has been successfully processed!
          </p>
        </div>

        {/* What's Next Section */}
        <div className="bg-surface-raised border border-surface-border rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-heading mb-6 text-brand-accent">What Happens Next?</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-brand-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-brand-accent font-semibold">1</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Check Your Email</h3>
                <p className="text-text-muted text-sm">
                  You'll receive a confirmation email within the next few minutes with your payment
                  receipt and program details.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-brand-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-brand-accent font-semibold">2</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Welcome Call</h3>
                <p className="text-text-muted text-sm">
                  I'll reach out within 24-48 hours to schedule your onboarding call and answer any
                  questions you may have.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-brand-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-brand-accent font-semibold">3</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Program Start</h3>
                <p className="text-text-muted text-sm">
                  You'll receive the cohort schedule, access to materials, and details about your
                  first session.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-text-primary mb-3">Important Information</h3>
          <ul className="space-y-2 text-text-muted text-sm">
            <li>• Keep your confirmation email for your records</li>
            <li>
              • Add contact@intrinsicmomentummindset.com to your contacts to ensure you receive all
              communications
            </li>
            <li>
              • If you don't receive a confirmation email within 1 hour, check your spam folder
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Return to Home
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
            </Button>
          </Link>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12 text-text-muted">
          <p className="text-sm">
            Questions? Email me at{' '}
            <a
              href="mailto:contact@intrinsicmomentummindset.com"
              className="text-brand-accent hover:text-brand-primary transition-colors underline"
            >
              contact@intrinsicmomentummindset.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
