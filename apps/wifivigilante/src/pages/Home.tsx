// src/pages/Home.tsx
import { motion } from 'framer-motion';
import { ShieldCheck, Shield, FileText, Users, TrendingUp, Award } from 'lucide-react';
import { H1, H2, P, StatCard, useReducedMotion } from '@krisarmstrong/web-foundation';

export default function Home(): React.ReactElement {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants - disabled for users who prefer reduced motion
  const fadeInUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      };

  const fadeIn = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.4 },
        };

  const slideIn = (delay: number, direction: 'left' | 'right') =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, x: direction === 'left' ? -20 : 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay, duration: 0.4 },
        };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.header {...fadeInUp} className="text-center mb-20 sm:mb-24">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 dark:from-brand-primary/25 dark:to-brand-accent/25 border border-brand-primary/30 dark:border-brand-primary/45 rounded-full text-brand-primary font-semibold text-sm sm:text-base">
            <Shield size={20} className="text-brand-primary" />
            Expert-Level Field Investigations
          </span>
        </div>
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 dark:from-brand-accent/15 dark:to-brand-primary/15 border border-brand-accent/20 dark:border-brand-accent/35 rounded-full text-brand-accent font-semibold text-xs sm:text-sm">
            <Award size={16} className="text-brand-accent" />
            20+ Years Experience • Enterprise Grade Tools • CWSP • CWDP • CWNA
          </span>
        </div>
        <H1
          icon={<ShieldCheck size={32} className="text-brand-primary" />}
          className="!mb-6 !text-4xl sm:!text-5xl"
        >
          Wi-Fi Vigilante
        </H1>
        <P className="text-xl sm:text-2xl font-semibold text-text-primary mb-6">
          Real-World Security Investigations & Network Forensics
        </P>
        <P className="text-base sm:text-lg text-text-primary max-w-3xl mx-auto leading-relaxed">
          Documenting field investigations into <strong>Wi-Fi security</strong>,{' '}
          <strong>cybersecurity incidents</strong>, and{' '}
          <strong>enterprise network troubleshooting</strong> using professional-grade tools and
          forensic techniques.
        </P>
      </motion.header>

      {/* Stats Section - Using StatCard component */}
      <motion.section {...fadeIn(0.2)} className="grid gap-8 md:grid-cols-3 mb-24">
        {[
          { icon: <FileText size={32} />, value: '200+', label: 'Real-World Cases' },
          { icon: <Shield size={32} />, value: 'Enterprise', label: 'Grade Analysis' },
          { icon: <Users size={32} />, value: '20+ Years', label: 'Field Experience' },
        ].map((stat) => (
          <div key={stat.label}>
            <StatCard
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              colorScheme="blue"
              size="lg"
            />
          </div>
        ))}
      </motion.section>

      {/* What You'll Find Section */}
      <motion.section {...fadeIn(0.3)} className="mb-24">
        <H2 className="text-center mb-12 !text-2xl sm:!text-3xl">What You'll Find</H2>
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            {...slideIn(0.4, 'left')}
            className="bg-surface-raised border border-surface-border p-8 rounded-2xl shadow-lg dark:shadow-black/30 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all"
          >
            <H2 className="!text-xl !mb-4 flex items-center gap-2">
              <ShieldCheck size={24} className="text-brand-primary" />
              Security Investigations
            </H2>
            <P className="text-text-primary mb-4">
              Rogue device detection, unauthorized access attempts, network intrusions, and
              cybersecurity incident response documented with professional tools.
            </P>
            <ul className="list-disc list-inside space-y-1 text-text-muted text-sm">
              <li>Rogue AP Detection & Mitigation</li>
              <li>Wi-Fi Security Assessments</li>
              <li>Incident Response & Forensics</li>
            </ul>
          </motion.div>

          <motion.div
            {...slideIn(0.5, 'right')}
            className="bg-surface-raised border border-surface-border p-8 rounded-2xl shadow-lg dark:shadow-black/30 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all"
          >
            <H2 className="!text-xl !mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-brand-primary" />
              Performance Troubleshooting
            </H2>
            <P className="text-text-primary mb-4">
              Layer 1-7 root cause analysis of wireless and wired network issues affecting
              enterprise environments, healthcare, education, and commercial sectors.
            </P>
            <ul className="list-disc list-inside space-y-1 text-text-muted text-sm">
              <li>RF Interference & Channel Analysis</li>
              <li>Client Connectivity Issues</li>
              <li>Network Performance Optimization</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Tools Section */}
      <motion.section
        {...fadeIn(0.6)}
        className="bg-surface-raised border border-surface-border p-10 rounded-2xl shadow-lg dark:shadow-black/30"
      >
        <H2 className="text-center mb-6 !text-2xl">Professional-Grade Tools</H2>
        <P className="text-center text-text-primary mb-8 max-w-2xl mx-auto">
          Every investigation leverages enterprise tools from NetAlly, Wireshark, and
          industry-standard analysis platforms.
        </P>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-text-muted max-w-2xl mx-auto">
          {[
            'NetAlly EtherScope nXG',
            'NetAlly AirCheck G3 Pro',
            'NetAlly CyberScope',
            'Wireshark',
            'Link-Live Cloud',
            'Nmap & OSINT',
          ].map((tool) => (
            <div key={tool} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
              {tool}
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
