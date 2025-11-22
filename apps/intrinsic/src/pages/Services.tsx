import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading mb-6">
            How We <span className="text-text-accent">Work Together</span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Choose the coaching path that aligns with your goals—whether you're seeking personalized
            1:1 support, the energy of group learning, or organizational transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 1:1 Coaching */}
          <div className="border-2 border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent transition-colors bg-surface-raised shadow-sm flex flex-col">
            <div className="h-2 w-16 bg-brand-accent rounded mb-6"></div>
            <h2 className="text-2xl font-heading mb-4">1:1 Coaching</h2>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Deep, personalized transformation. Just you and me.
            </h3>
            <p className="text-text-muted mb-4 leading-relaxed">
              Personalized coaching for individuals, professionals, and executives. Deep work on
              mindset, leadership, and strategic growth tailored to your unique goals and
              challenges.
            </p>
            <p className="text-sm font-semibold text-text-accent mb-3">Highlights:</p>
            <ul className="space-y-2 text-text-muted mb-4 text-sm">
              <li>• Weekly or bi-weekly sessions</li>
              <li>• Custom strategic roadmap</li>
              <li>• Between-session support</li>
              <li>• 3, 6, or 12-month engagements</li>
            </ul>
            <p className="text-sm italic text-text-muted mb-6 border-l-4 border-brand-accent pl-4">
              "The fastest path to transformation is focused attention on what matters most to you."
            </p>
            <Link
              to="/contact"
              className="inline-block w-full bg-brand-accent text-primary-dark font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-center mt-auto"
            >
              Book A Call
            </Link>
          </div>

          {/* Intrinsic Foundations */}
          <div className="border-2 border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent transition-colors bg-surface-raised shadow-sm flex flex-col">
            <div className="h-2 w-16 bg-brand-accent rounded mb-6"></div>
            <h2 className="text-2xl font-heading mb-4">Intrinsic Foundations — Group Coaching</h2>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Release the labels. Reclaim who you actually are.
            </h3>
            <p className="text-text-muted mb-4 leading-relaxed">
              This program is all about stripping off the identities that were handed to you — by
              family, culture, trauma, old roles, or your own outdated beliefs. People start here
              when they're ready to stop performing versions of themselves that no longer fit.
            </p>
            <p className="text-sm font-semibold text-text-accent mb-3">Highlights:</p>
            <ul className="space-y-2 text-text-muted mb-4 text-sm">
              <li>• 60-minute group sessions</li>
              <li>• Core mindset + identity frameworks</li>
              <li>• Guided unlabeling + reframing exercises</li>
              <li>• Peer support for accountability and reflection</li>
              <li>• 4-week program + 1 private session</li>
            </ul>
            <p className="text-sm italic text-text-muted mb-6 border-l-4 border-brand-accent pl-4">
              "Before you build momentum, you have to stop carrying the wrong identity."
            </p>
            <Link
              to="/contact"
              className="inline-block w-full bg-brand-accent text-primary-dark font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-center mt-auto"
            >
              Join A Cohort
            </Link>
          </div>

          {/* Intrinsic Momentum */}
          <div className="border-2 border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent transition-colors bg-surface-raised shadow-sm flex flex-col">
            <div className="h-2 w-16 bg-brand-accent rounded mb-6"></div>
            <h2 className="text-2xl font-heading mb-4">Intrinsic Momentum — Group Coaching</h2>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              You've cleared out the noise. Now it's time to build the engine.
            </h3>
            <p className="text-text-muted mb-4 leading-relaxed">
              This tier combines the identity clarity of Intrinsic Foundations with the
              forward-drive of Momentum frameworks. It's where people stop thinking about change and
              start producing it — reliably.
            </p>
            <p className="text-sm font-semibold text-text-accent mb-3">Highlights:</p>
            <ul className="space-y-2 text-text-muted mb-4 text-sm">
              <li>• 60-minute group sessions</li>
              <li>• Integrated Intrinsic + Momentum model (identity → behavior → results)</li>
              <li>• Tools for decision-making, discipline, and consistent execution</li>
              <li>• Structured peer coaching + real-world application</li>
              <li>• Systems for building sustainable habits and forward movement</li>
              <li>• 8-week program + 1 private strategy session</li>
            </ul>
            <p className="text-sm italic text-text-muted mb-6 border-l-4 border-brand-accent pl-4">
              "Turn clarity into acceleration. Build momentum you can actually sustain."
            </p>
            <Link
              to="/contact"
              className="inline-block w-full bg-brand-accent text-primary-dark font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-center mt-auto"
            >
              Join A Cohort
            </Link>
          </div>

          {/* Mindset Immersion */}
          <div className="border-2 border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent transition-colors bg-surface-raised shadow-sm flex flex-col">
            <div className="h-2 w-16 bg-brand-accent rounded mb-6"></div>
            <h2 className="text-2xl font-heading mb-4">Mindset Immersion — Group Coaching</h2>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              The full transformation chamber. Not for dabblers.
            </h3>
            <p className="text-text-muted mb-4 leading-relaxed">
              This is where you combine Intrinsic, Momentum, and deep Mindset work into one elite,
              comprehensive experience. Think: pattern rewiring, identity shifts, and leadership
              embodiment.
            </p>
            <p className="text-sm font-semibold text-text-accent mb-3">Highlights:</p>
            <ul className="space-y-2 text-text-muted mb-4 text-sm">
              <li>• 60-minute intensive sessions</li>
              <li>• Deep psychological frameworks & advanced mindset engineering</li>
              <li>• Personalized growth architecture</li>
              <li>• Immersive peer coaching</li>
              <li>• 12-week curriculum + 2 private sessions</li>
            </ul>
            <p className="text-sm italic text-text-muted mb-6 border-l-4 border-brand-accent pl-4">
              "Rewire the system. Become impossible to ignore. Transform from the inside out."
            </p>
            <Link
              to="/contact"
              className="inline-block w-full bg-brand-accent text-primary-dark font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-center mt-auto"
            >
              Join A Cohort
            </Link>
          </div>

          {/* Corporate Leadership */}
          <div className="border-2 border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent transition-colors bg-surface-raised shadow-sm flex flex-col">
            <div className="h-2 w-16 bg-brand-accent rounded mb-6"></div>
            <h2 className="text-2xl font-heading mb-4">Corporate Leadership</h2>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Build leaders who inspire movement, not just management.
            </h3>
            <p className="text-text-muted mb-4 leading-relaxed">
              Workshops, leadership training, and keynote speaking for organizations committed to
              developing exceptional leaders who drive real cultural transformation.
            </p>
            <p className="text-sm font-semibold text-text-accent mb-3">Highlights:</p>
            <ul className="space-y-2 text-text-muted mb-4 text-sm">
              <li>• Leadership development programs</li>
              <li>• Team coaching & culture work</li>
              <li>• Keynote speaking</li>
              <li>• Custom workshops</li>
            </ul>
            <p className="text-sm italic text-text-muted mb-6 border-l-4 border-brand-accent pl-4">
              "Great organizations don't just manage people—they develop leaders worth following."
            </p>
            <Link
              to="/contact"
              className="inline-block w-full bg-brand-accent text-primary-dark font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-center mt-auto"
            >
              Book A Call
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-brand-accent/10 rounded-2xl p-8 md:p-12 text-center border-2 border-brand-accent/30">
          <h2 className="text-3xl font-heading mb-4">Not Sure Which Path Is Right for You?</h2>
          <p className="text-text-muted mb-8 max-w-2xl mx-auto">
            Book a free 30-minute consultation to discuss your goals and find the best fit.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-brand-accent text-primary-dark font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Schedule Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
