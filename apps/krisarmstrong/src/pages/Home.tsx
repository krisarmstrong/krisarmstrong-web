import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { H1, P } from '../components/ui/Typography';
import { TrendingUp, Radio, Shield, Code2, Mail, User } from 'lucide-react';

const valueCards = [
  {
    title: '$33M Revenue Impact',
    to: '/resume',
    description:
      'Senior member of 2-person SE team at NetAlly. Personally increased regional deal win rates by 65%, generating $12M in incremental bookings.',
    icon: <TrendingUp size={32} />,
  },
  {
    title: 'Wi-Fi Vigilante Platform',
    to: 'https://wi-fi-vigilante.com',
    description:
      'Comprehensive network investigation and troubleshooting platform used by network professionals worldwide. Real-time packet analysis and RF visualization.',
    icon: <Radio size={32} />,
    external: true,
  },
  {
    title: 'CISSP + Wireless Expert',
    to: '/skills',
    description:
      'Industry-leading certifications (CISSP, CWSP, CWDP, CWNA) with 20+ years of network engineering experience. Wi-Fi 6/6E/7 and Zero Trust specialist.',
    icon: <Shield size={32} />,
  },
  {
    title: 'Open Source Contributor',
    to: '/projects',
    description:
      '12+ active GitHub projects including network automation tools, security testing frameworks, and device simulators built with Python, Go, and TypeScript.',
    icon: <Code2 size={32} />,
  },
  {
    title: 'Available for Consulting',
    to: '/contact',
    description:
      "Seeking opportunities in technical pre-sales, network architecture design, wireless infrastructure, and security consulting. Let's collaborate.",
    icon: <Mail size={32} />,
  },
];

export default function Home() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <H1 icon={<User size={32} className="text-brand-primary" />} className="!mb-4">
            Kris Armstrong
          </H1>
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-accent/20 to-brand-accent/20 dark:from-brand-accent/25 dark:to-brand-accent/25 border border-brand-accent/30 dark:border-brand-accent/45 rounded-full text-brand-accent font-semibold text-sm sm:text-base">
              <Shield size={20} className="text-brand-accent" />
              CISSP • CWSP • CWDP • CWNA
            </span>
          </div>
          <P className="text-xl sm:text-2xl font-semibold text-text-primary mb-3">
            Driving $33M+ Revenue Through Technical Excellence
          </P>
          <P className="text-base sm:text-lg text-text-muted max-w-3xl mx-auto">
            20+ years engineering secure, high-performance enterprise networks. Wi-Fi 6/6E/7
            specialist. Helping organizations design wireless architectures that deliver business
            results.
          </P>
        </motion.div>
      </div>

      {/* Value Proposition Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-16"
      >
        {valueCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="block bg-surface-raised p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] border border-surface-border hover:border-brand-accent/50 transition-all no-underline"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-text-accent">{card.icon}</div>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">{card.title}</h3>
            <p className="text-sm text-text-muted leading-normal">{card.description}</p>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
