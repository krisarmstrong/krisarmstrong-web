import { Heart, Lightbulb, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32 relative overflow-hidden">
        <div className="dot-pattern" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-text-primary fade-in-up">
              Lead From Within.
              <br />
              <span className="text-text-primary">Build Momentum.</span>
              <br />
              <span className="text-text-accent">Transform Your Mind.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto fade-in-up">
              Grounded, intelligent coaching for individuals, professionals, and executives ready to
              move beyond surface-level change.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up">
            <Link
              to="/contact"
              className="bg-brand-accent text-text-inverse font-semibold px-8 py-4 rounded-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 text-lg"
            >
              Book a Consult
            </Link>
            <Link
              to="/about"
              className="border-2 border-brand-primary text-text-primary font-semibold px-8 py-4 rounded-lg hover:bg-brand-primary hover:text-text-inverse transition-all duration-200 text-lg"
            >
              Learn the Method
            </Link>
          </div>
          <div className="accent-divider" aria-hidden="true" />
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 bg-surface-raised">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-16">
            The <span className="text-text-accent">Intrinsic Momentum Mindset</span> Philosophy
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center enhanced-card accent-border-top p-8 stagger-item">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/20 mb-6 border-2 border-brand-accent">
                <Heart size={40} className="text-text-accent" />
              </div>
              <h3 className="text-2xl font-heading mb-4">Intrinsic</h3>
              <p className="text-text-muted leading-relaxed">
                True transformation starts from within. We focus on uncovering your core values,
                authentic motivations, and internal drivers.
              </p>
            </div>
            <div className="text-center enhanced-card accent-border-top p-8 stagger-item">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/20 mb-6 border-2 border-brand-accent">
                <Lightbulb size={40} className="text-text-accent" />
              </div>
              <h3 className="text-2xl font-heading mb-4">Momentum</h3>
              <p className="text-text-muted leading-relaxed">
                Clarity without action is just theory. We build sustainable forward motion through
                intentional practices and strategic implementation.
              </p>
            </div>
            <div className="text-center enhanced-card accent-border-top p-8 stagger-item">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/20 mb-6 border-2 border-brand-accent">
                <Brain size={40} className="text-text-accent" />
              </div>
              <h3 className="text-2xl font-heading mb-4">Mindset</h3>
              <p className="text-text-muted leading-relaxed">
                Your mental frameworks determine your reality. We rewire limiting beliefs and
                develop the emotional intelligence necessary for lasting change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-accent/10 border-y-2 border-brand-accent dark:bg-brand-accent/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-text-muted mb-8">
            Whether you're an individual seeking personal growth or a professional looking to
            elevate your leadership, we're here to guide you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-brand-accent text-text-inverse font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              View Services
            </Link>
            <Link
              to="/contact"
              className="border-2 border-brand-primary text-text-primary font-semibold px-8 py-4 rounded-lg hover:bg-brand-primary hover:text-text-inverse transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
