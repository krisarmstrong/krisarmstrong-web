// src/pages/Home.tsx
import { ShieldCheck, Shield, FileText, Users, TrendingUp } from 'lucide-react';
import { H1, H2, P } from '@krisarmstrong/web-foundation';

export default function Home(): React.ReactElement {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <header className="text-center mb-16 sm:mb-20">
        <div className="mb-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border border-brand-primary/30 rounded-full text-brand-primary font-semibold text-sm sm:text-base">
            <Shield size={20} className="text-brand-primary" />
            Expert-Level Field Investigations
          </span>
        </div>
        <H1
          icon={<ShieldCheck size={32} className="text-brand-primary" />}
          className="!mb-4 !text-4xl sm:!text-5xl"
        >
          Wi-Fi Vigilante
        </H1>
        <P className="text-xl sm:text-2xl font-semibold text-text-primary mb-3">
          Real-World Security Investigations & Network Forensics
        </P>
        <P className="text-base sm:text-lg text-text-primary max-w-3xl mx-auto leading-relaxed">
          Documenting field investigations into <strong>Wi-Fi security</strong>,{' '}
          <strong>cybersecurity incidents</strong>, and{' '}
          <strong>enterprise network troubleshooting</strong> using professional-grade tools and
          forensic techniques.
        </P>
      </header>

      {/* Stats Section */}
      <section className="grid gap-6 md:grid-cols-3 mb-16">
        <div className="bg-surface-raised/50 border border-surface-border p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-3">
            <FileText size={32} className="text-brand-primary" />
          </div>
          <P className="text-3xl font-bold text-text-primary mb-1">200+</P>
          <P className="text-text-muted text-sm">Real-World Cases</P>
        </div>
        <div className="bg-surface-raised/50 border border-surface-border p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-3">
            <Shield size={32} className="text-brand-primary" />
          </div>
          <P className="text-3xl font-bold text-text-primary mb-1">Enterprise</P>
          <P className="text-text-muted text-sm">Grade Analysis</P>
        </div>
        <div className="bg-surface-raised/50 border border-surface-border p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-3">
            <Users size={32} className="text-brand-primary" />
          </div>
          <P className="text-3xl font-bold text-text-primary mb-1">20+ Years</P>
          <P className="text-text-muted text-sm">Field Experience</P>
        </div>
      </section>

      {/* What You'll Find Section */}
      <section className="mb-16">
        <H2 className="text-center mb-8 !text-2xl sm:!text-3xl">What You'll Find</H2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-surface-raised border border-surface-border p-6 rounded-lg hover:shadow-lg transition-shadow">
            <H2 className="!text-xl !mb-3 flex items-center gap-2">
              <ShieldCheck size={24} className="text-brand-primary" />
              Security Investigations
            </H2>
            <P className="text-text-primary mb-3">
              Rogue device detection, unauthorized access attempts, network intrusions, and
              cybersecurity incident response documented with professional tools.
            </P>
            <ul className="list-disc list-inside space-y-1 text-text-muted text-sm">
              <li>Rogue AP Detection & Mitigation</li>
              <li>Wi-Fi Security Assessments</li>
              <li>Incident Response & Forensics</li>
            </ul>
          </div>

          <div className="bg-surface-raised border border-surface-border p-6 rounded-lg hover:shadow-lg transition-shadow">
            <H2 className="!text-xl !mb-3 flex items-center gap-2">
              <TrendingUp size={24} className="text-brand-primary" />
              Performance Troubleshooting
            </H2>
            <P className="text-text-primary mb-3">
              Layer 1-7 root cause analysis of wireless and wired network issues affecting
              enterprise environments, healthcare, education, and commercial sectors.
            </P>
            <ul className="list-disc list-inside space-y-1 text-text-muted text-sm">
              <li>RF Interference & Channel Analysis</li>
              <li>Client Connectivity Issues</li>
              <li>Network Performance Optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-gradient-to-br from-surface-raised/50 to-surface-base/50 border border-surface-border p-8 rounded-lg">
        <H2 className="text-center mb-4 !text-2xl">Professional-Grade Tools</H2>
        <P className="text-center text-text-primary mb-6 max-w-2xl mx-auto">
          Every investigation leverages enterprise tools from NetAlly, Wireshark, and
          industry-standard analysis platforms.
        </P>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-text-muted max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            NetAlly EtherScope nXG
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            NetAlly AirCheck G3 Pro
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            NetAlly CyberScope
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            Wireshark
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            Link-Live Cloud
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            Nmap & OSINT
          </div>
        </div>
      </section>
    </div>
  );
}
