/**
 * @fileoverview Registration page for coaching program enrollment
 * Collects customer information before redirecting to PayPal for payment
 * @module pages/Register
 */

import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@krisarmstrong/web-foundation';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateDateOfBirth,
  validateAddress,
  validateCity,
  validateState,
  validateZipCode,
  validatePayPalUrl,
  validateFormEndpoint,
} from '../utils/validation';

// Program details mapping
const PROGRAMS = {
  'intrinsic-foundations': {
    name: 'Intrinsic Foundations',
    duration: '4 weeks',
    price: 'TBD',
    paypalLink: import.meta.env.VITE_PAYPAL_INTRINSIC_FOUNDATIONS || '#',
  },
  'intrinsic-momentum': {
    name: 'Intrinsic Momentum',
    duration: '8 weeks',
    price: 'TBD',
    paypalLink: import.meta.env.VITE_PAYPAL_INTRINSIC_MOMENTUM || '#',
  },
  'mindset-immersion': {
    name: 'Mindset Immersion',
    duration: '12 weeks',
    price: 'TBD',
    paypalLink: import.meta.env.VITE_PAYPAL_MINDSET_IMMERSION || '#',
  },
} as const;

type ProgramKey = keyof typeof PROGRAMS;

/**
 * Register - Program registration and enrollment page
 *
 * Collects customer information and redirects to PayPal for payment
 * Form data is submitted to formspree before PayPal redirect
 */
export default function Register() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = PROGRAMS[programId as ProgramKey];

  // Redirect to services if invalid program
  if (!program) {
    navigate('/services');
    return null;
  }

  const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || '';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Extract form values for validation
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const dob = formData.get('dob') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zip = formData.get('zip') as string;

    // Validate form endpoint
    const endpointValidation = validateFormEndpoint(formEndpoint);
    if (!endpointValidation.isValid) {
      setError(endpointValidation.error || 'Form configuration error. Please contact support.');
      setSubmitting(false);
      return;
    }

    // Validate PayPal URL
    const paypalValidation = validatePayPalUrl(program.paypalLink);
    if (!paypalValidation.isValid) {
      setError(paypalValidation.error || 'Payment configuration error. Please contact support.');
      setSubmitting(false);
      return;
    }

    // Validate all form fields
    const validations = [
      validateName(name),
      validateEmail(email),
      validatePhone(phone),
      validateDateOfBirth(dob),
      validateAddress(address),
      validateCity(city),
      validateState(state),
      validateZipCode(zip),
    ];

    // Find first validation error
    const firstError = validations.find((v) => !v.isValid);
    if (firstError) {
      setError(firstError.error || 'Please check your form inputs');
      setSubmitting(false);
      return;
    }

    try {
      // Submit to formspree
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to PayPal after successful form submission
        window.location.href = program.paypalLink;
      } else {
        setError('There was an issue submitting your registration. Please try again.');
        setSubmitting(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
      } else if (errorMessage.includes('timeout')) {
        setError('Request timed out. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }

      setSubmitting(false);

      if (import.meta.env.DEV) {
        console.error('Registration error:', err);
      }
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">
            Join <span className="text-brand-accent">{program.name}</span>
          </h1>
          <p className="text-xl text-text-muted mb-2">
            {program.duration} • Group Coaching Program
          </p>
          <p className="text-text-muted">
            Complete the form below to reserve your spot. You'll be redirected to PayPal to complete
            payment.
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-surface-raised border-2 border-brand-accent/30 rounded-2xl p-8 shadow-lg hover:border-brand-accent transition-colors">
          <div className="h-2 w-16 bg-brand-accent rounded mb-6"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden field for program name */}
            <input type="hidden" name="program" value={program.name} />

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-brand-primary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={100}
                pattern="^[a-zA-Z\s'-]+$"
                className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                placeholder="John Doe"
                title="Name must be 2-100 characters, letters only"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-brand-primary mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-brand-primary mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-brand-primary mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-brand-primary mb-2"
              >
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                minLength={5}
                maxLength={200}
                className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                placeholder="123 Main Street"
                title="Address must be 5-200 characters"
              />
            </div>

            {/* City, State, Zip in a row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-brand-primary mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                  placeholder="New York"
                  title="City must be 2-50 characters"
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-brand-primary mb-2"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  minLength={2}
                  maxLength={2}
                  pattern="^[A-Z]{2}$"
                  style={{ textTransform: 'uppercase' }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                  placeholder="NY"
                  title="2-letter state code (e.g., CA, NY)"
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="zip"
                  className="block text-sm font-semibold text-brand-primary mb-2"
                >
                  Zip Code *
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  required
                  pattern="^\d{5}(-\d{4})?$"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary/30 bg-surface-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                  placeholder="10001"
                  title="5-digit ZIP code or ZIP+4 format"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-status-error/10 border border-status-error/30 rounded-lg p-4">
                <p className="text-status-error text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Processing...' : 'Continue to Payment'}
              </Button>
              <p className="text-xs text-text-muted text-center mt-4">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </form>
        </div>

        {/* Back to Services Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/services')}
            className="text-text-accent hover:text-brand-primary transition-colors underline"
          >
            ← Back to Services
          </button>
        </div>
      </div>
    </div>
  );
}
