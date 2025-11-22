import { motion } from "framer-motion";
import { Code2, ExternalLink } from "lucide-react";
import Timeline from "../components/Timeline";
import Testimonials from "../components/Testimonials";

export default function About() {
  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div className="bg-surface-raised p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">Who I Am</h2>
          <p>
            I'm Kris Armstrong, a senior-level Sales Engineer, Systems Engineer, and Network Engineer with deep expertise in enterprise wired and wireless (Wi-Fi 6/6E/7) infrastructure and network security architecture. Since founding Armstrong Consulting LLC in January 2025, I've delivered comprehensive technical solutions to enterprise, SLED (State, Local, and Education), and public safety organizations nationwide. My approach combines technical excellence with business acumen, ensuring every solution I design not only meets technical requirements but drives real business value.
          </p>
        </div>
        <div className="bg-surface-raised p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">Key Achievements</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Architected and developed <strong>Wi-Fi Vigilante</strong>—a comprehensive network investigation and troubleshooting platform used by network professionals</li>
            <li>Designed campus-wide <strong>Wi-Fi 6E networks</strong> supporting 10,000+ users across 50+ buildings for major SLED organizations</li>
            <li>Implemented <strong>mission-critical wireless infrastructure</strong> for public safety and emergency services organizations</li>
            <li>Led technical pre-sales engagements resulting in <strong>multi-million dollar</strong> enterprise network deployments</li>
            <li>Deployed <strong>Zero Trust network architectures</strong> and HIPAA-compliant wireless solutions for healthcare organizations</li>
            <li>Hold industry-leading certifications: <strong>CISSP, CWSP, CWDP, CWNA</strong>—demonstrating mastery in security and wireless engineering</li>
            <li>Expert in multi-vendor environments: <strong>Cisco, Aruba, Juniper, Fortinet, Palo Alto Networks</strong></li>
          </ul>
        </div>
        <div className="bg-surface-raised p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">What Drives Me</h2>
          <p>
            I'm passionate about solving complex technical challenges and delivering network infrastructure that's not just functional, but secure, scalable, and optimized for performance. Every engagement is an opportunity to combine cutting-edge wireless technology with time-tested security principles to create solutions that exceed expectations. Whether it's designing a campus-wide Wi-Fi 6E deployment, architecting a Zero Trust network, conducting RF optimization in a high-density environment, or leading technical pre-sales for mission-critical systems, I bring the same level of dedication and expertise. My goal is always to deliver solutions that work flawlessly from day one and continue to perform reliably for years to come.
          </p>
        </div>

        <div className="bg-surface-raised p-6 rounded-2xl shadow-lg border border-brand-accent/30">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="text-text-accent" size={28} />
            <h2 className="text-2xl font-semibold">Open Source Contributions</h2>
          </div>
          <p className="mb-4 text-text-primary">
            I actively contribute to the network engineering and security community through open-source projects. My work focuses on building practical tools that solve real-world networking challenges including network testing frameworks, security utilities, and automation tools.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-text-muted">Featured projects include:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm text-text-primary">
              <li>Network troubleshooting platforms with real-time analysis</li>
              <li>EAP authentication testing frameworks</li>
              <li>Network device simulators (SNMP, SSH, NetFlow)</li>
              <li>NetAlly hardware automation tools</li>
              <li>Python, Go, and TypeScript utilities</li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-surface-border">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 text-text-accent hover:text-interactive-hover font-semibold"
            >
              View All Projects <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </motion.div>
      <Timeline />
      <Testimonials />
    </section>
  );
}
