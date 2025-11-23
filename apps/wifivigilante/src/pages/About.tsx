// src/pages/About.tsx
import React from 'react';
import { ShieldCheck, Wifi, Globe, Terminal, Mail, UserPlus } from 'lucide-react';
import { H1, H2, P } from '@krisarmstrong/web-foundation';
import { Button } from '../components/ui/Button.jsx';

// Inline SVG for Github Icon
const GithubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// Inline SVG for LinkedIn Icon
const LinkedinIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.134 1.445-2.134 2.939v5.667h-3.554V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.369-1.849 3.602 0 4.267 2.368 4.267 5.455v6.285zM5.337 7.433c-1.144 0-2.069-.926-2.069-2.068 0-1.143.925-2.069 2.069-2.069 1.143 0 2.068.926 2.068 2.069 0 1.142-.925 2.068-2.068 2.068zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z" />
  </svg>
);

// InfoCard component props interface
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

// Reusable InfoCard component
function InfoCard({ icon, title, children }: InfoCardProps): React.ReactElement {
  return (
    <section className="bg-surface-raised border border-surface-border p-8 rounded-lg shadow-lg">
      <H2 icon={icon} className="!text-xl !mb-4">
        {title}
      </H2>
      <div className="space-y-2 text-text-primary">{children}</div>
    </section>
  );
}

export default function About(): React.ReactElement {
  return (
    <div className="px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 sm:mb-16">
          <H1 icon={<ShieldCheck size={32} className="text-brand-primary" />} className="!mb-6">
            About Wi-Fi Vigilante
          </H1>
          <P className="text-lg text-text-primary">
            <strong>Wi-Fi Vigilante</strong> is a curated series of real-world field investigations
            documenting problems, exploits, and misconfigurations in Wi-Fi, cybersecurity, and wired
            networking. Each case highlights root cause analysis and professional-grade tools used
            in high-stakes environments.
          </P>
        </header>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <InfoCard icon={<Wifi size={24} className="text-brand-primary" />} title="Focus Areas">
            <ul className="list-disc list-inside space-y-1">
              <li>Enterprise Wi-Fi validation & Performance</li>
              <li>Network Security Assessments</li>
              <li>Rogue Device Detection & Mitigation</li>
              <li>Layer 1–7 Root Cause Analysis</li>
              <li>Cybersecurity Incident Response</li>
            </ul>
          </InfoCard>

          <InfoCard
            icon={<Terminal size={24} className="text-brand-primary" />}
            title="Tools Featured"
          >
            <P className="mb-2">Detailed analyses often feature tools such as:</P>
            <ul className="list-disc list-inside space-y-1">
              <li>NetAlly EtherScope nXG</li>
              <li>NetAlly AirCheck G3 Pro</li>
              <li>NetAlly LinkRunner 10G / AT</li>
              <li>NetAlly CyberScope / Air</li>
              <li>Link-Live Cloud Platform</li>
              <li>Wireshark, Nmap, & various OSINT tools</li>
            </ul>
          </InfoCard>
        </div>

        <div className="space-y-8">
          <InfoCard icon={<Globe size={24} className="text-brand-primary" />} title="Our Audience">
            <P>
              Network Engineers, Wi-Fi Professionals, Penetration Testers, Field Technicians, IT
              Managers, and anyone tasked with validating, troubleshooting, or defending modern
              wired and wireless environments.
            </P>
          </InfoCard>

          <InfoCard
            icon={<UserPlus size={24} className="text-brand-primary" />}
            title="Get Involved"
          >
            <P className="mb-4">
              Have an interesting case study or want to connect with the Vigilante network? Let's
              collaborate.
            </P>
            <div className="flex flex-wrap gap-3">
              <Button
                as="a"
                href="https://github.com/krisarmstrong"
                variant="secondary"
                leftIcon={<GithubIcon />}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kris Armstrong on GitHub"
              >
                GitHub
              </Button>
              <Button
                as="a"
                href="https://www.linkedin.com/in/kris-armstrong-cissp/"
                variant="secondary"
                leftIcon={<LinkedinIcon />}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
              >
                Connect on LinkedIn
              </Button>
              <Button
                as="a"
                href="mailto:kris@wi-fi-vigilante.com"
                variant="secondary"
                leftIcon={<Mail size={18} />}
                aria-label="Submit a Case via Email"
              >
                Submit a Case
              </Button>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
