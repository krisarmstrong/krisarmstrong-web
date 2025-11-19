export default function About() {
  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-heading text-center mb-12">
          No Fluff. No Toxic Positivity.<br />
          <span className="text-text-accent">Just Real Growth.</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="aspect-square bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-brand-accent/20">
            <p className="text-text-muted text-xl">[ Photo Placeholder ]</p>
          </div>
          <div className="space-y-6 text-text-muted leading-relaxed">
            <p className="text-lg">
              I work with individuals, professionals, executives, and leaders who are tired of generic advice and ready for transformation that actually sticks.
            </p>
            <p>
              My approach combines evidence-based psychology, practical strategy, and deep emotional intelligence. We don't chase quick wins—we build sustainable systems for long-term success.
            </p>
            <p>
              This isn't about mantras or manifestation. It's about doing the real work: understanding your patterns, challenging your assumptions, and building the skills that separate good leaders from exceptional ones.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-brand-accent/5 rounded-2xl p-8 md:p-12 border-l-4 border-brand-accent">
          <h2 className="text-3xl font-heading mb-8 text-center">What I Believe</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-heading mb-3 text-text-accent">Grounded in Reality</h3>
              <p className="text-text-muted">
                Real transformation requires honest self-assessment and practical strategies, not wishful thinking.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading mb-3 text-text-accent">Built on Evidence</h3>
              <p className="text-text-muted">
                My methods are rooted in psychology, neuroscience, and proven frameworks that create lasting change.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading mb-3 text-text-accent">Focused on Action</h3>
              <p className="text-text-muted">
                Insight without implementation is useless. We focus on building momentum through consistent, strategic action.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading mb-3 text-text-accent">Designed for You</h3>
              <p className="text-text-muted">
                There's no one-size-fits-all approach. We'll create a custom roadmap aligned with your unique goals and challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
