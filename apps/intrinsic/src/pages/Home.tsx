import { motion } from 'framer-motion';
import { Heart, Lightbulb, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32 relative overflow-hidden">
        <div className="dot-pattern" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-text-primary">
              Lead From Within.
              <br />
              <span className="text-text-primary">Build Momentum.</span>
              <br />
              <span className="text-text-accent">Transform Your Mind.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto">
              Grounded, intelligent coaching for individuals, professionals, and executives ready to
              move beyond surface-level change.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
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
          </motion.div>
          <div className="accent-divider" aria-hidden="true" />
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 bg-surface-raised">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-heading text-center mb-16"
          >
            The <span className="text-text-accent">Intrinsic Momentum Mindset</span> Philosophy
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: 'Intrinsic',
                description:
                  'True transformation starts from within. We focus on uncovering your core values, authentic motivations, and internal drivers.',
              },
              {
                icon: Lightbulb,
                title: 'Momentum',
                description:
                  'Clarity without action is just theory. We build sustainable forward motion through intentional practices and strategic implementation.',
              },
              {
                icon: Brain,
                title: 'Mindset',
                description:
                  'Your mental frameworks determine your reality. We rewire limiting beliefs and develop the emotional intelligence necessary for lasting change.',
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center enhanced-card accent-border-top p-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/20 mb-6 border-2 border-brand-accent">
                  <pillar.icon size={40} className="text-text-accent" />
                </div>
                <h3 className="text-2xl font-heading mb-4">{pillar.title}</h3>
                <p className="text-text-muted leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="py-20 bg-brand-accent/10 border-y-2 border-brand-accent dark:bg-brand-accent/15"
      >
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
      </motion.section>
    </div>
  );
}
