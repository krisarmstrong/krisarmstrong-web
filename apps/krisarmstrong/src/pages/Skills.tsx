import { motion } from "framer-motion";
import { Cpu, Shield, Cloud, Code, Network, Radio } from "lucide-react";

interface SkillCategory {
  icon: typeof Cpu;
  title: string;
  color: string;
  skills: {name: string; level: number}[];
}

const skillCategories: SkillCategory[] = [
  {
    icon: Network,
    title: "Network Engineering",
    color: "violet",
    skills: [
      { name: "Enterprise Wired/Wireless Design", level: 95 },
      { name: "Wi-Fi 6/6E/7", level: 95 },
      { name: "Cisco/Aruba/Juniper", level: 90 },
      { name: "BGP/OSPF/MPLS", level: 85 },
      { name: "SD-WAN", level: 85 },
      { name: "QoS & Traffic Engineering", level: 90 },
    ],
  },
  {
    icon: Radio,
    title: "Wireless Technologies",
    color: "blue",
    skills: [
      { name: "RF Planning & Design", level: 95 },
      { name: "Site Surveys & Validation", level: 95 },
      { name: "Spectrum Analysis", level: 90 },
      { name: "Capacity Planning", level: 90 },
      { name: "Ekahau/NetAlly Tools", level: 95 },
      { name: "802.11 Standards", level: 95 },
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    color: "red",
    skills: [
      { name: "CISSP - Security Architecture", level: 95 },
      { name: "Wireless Security (CWSP)", level: 95 },
      { name: "Zero Trust Architecture", level: 90 },
      { name: "802.1X/EAP", level: 90 },
      { name: "Penetration Testing", level: 85 },
      { name: "PCI DSS/ISO 27001", level: 85 },
    ],
  },
  {
    icon: Code,
    title: "Development & Automation",
    color: "green",
    skills: [
      { name: "Python", level: 90 },
      { name: "Go", level: 80 },
      { name: "TypeScript/JavaScript", level: 85 },
      { name: "React/Node.js", level: 80 },
      { name: "Ansible", level: 85 },
      { name: "Git/CI/CD", level: 85 },
    ],
  },
  {
    icon: Cloud,
    title: "Cloud & Infrastructure",
    color: "cyan",
    skills: [
      { name: "AWS", level: 80 },
      { name: "Azure", level: 75 },
      { name: "Docker/Podman", level: 85 },
      { name: "Hybrid Cloud Design", level: 85 },
      { name: "Infrastructure as Code", level: 80 },
      { name: "Cloud Security", level: 85 },
    ],
  },
  {
    icon: Cpu,
    title: "Sales Engineering",
    color: "amber",
    skills: [
      { name: "Technical Pre-Sales", level: 95 },
      { name: "RFP/RFQ Response", level: 95 },
      { name: "Solution Architecture", level: 90 },
      { name: "POC Development", level: 90 },
      { name: "Executive Presentations", level: 90 },
      { name: "Customer Training", level: 95 },
    ],
  },
];

const colorClasses: Record<string, {bg: string; text: string; border: string}> = {
  violet: { bg: "bg-violet-500", text: "text-violet-400", border: "border-violet-500/30" },
  blue: { bg: "bg-blue-500", text: "text-blue-400", border: "border-blue-500/30" },
  red: { bg: "bg-red-500", text: "text-red-400", border: "border-red-500/30" },
  green: { bg: "bg-green-500", text: "text-green-400", border: "border-green-500/30" },
  cyan: { bg: "bg-cyan-500", text: "text-cyan-400", border: "border-cyan-500/30" },
  amber: { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30" },
};

const certifications = [
  { name: "CISSP", org: "(ISC)²", full: "Certified Information Systems Security Professional" },
  { name: "CWSP", org: "CWNP", full: "Certified Wireless Security Professional" },
  { name: "CWDP", org: "CWNP", full: "Certified Wireless Design Professional" },
  { name: "CWNA", org: "CWNP", full: "Certified Wireless Network Administrator" },
];

export default function Skills() {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {skillCategories.map((category, i) => {
          const Icon = category.icon;
          const colors = colorClasses[category.color];
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`bg-surface-raised p-6 rounded-2xl shadow-lg border ${colors.border}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className={colors.text} size={28} />
                <h2 className="text-xl font-semibold">{category.title}</h2>
              </div>
              <div className="space-y-3">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-text-primary">{skill.name}</span>
                      <span className="text-xs text-text-muted">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                        className={`h-full ${colors.bg} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-surface-raised p-8 rounded-2xl shadow-lg border border-brand-accent/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-text-accent" size={32} />
          <h2 className="text-2xl font-semibold">Professional Certifications</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-start gap-4 bg-surface-raised p-4 rounded-xl"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="font-bold text-sm">{cert.name}</span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">{cert.full}</h3>
                <p className="text-sm text-text-muted">{cert.org}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tools & Technologies */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 bg-surface-raised p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6">Tools & Platforms</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Ekahau", "NetAlly", "Wireshark", "Cisco",
            "Aruba", "Juniper", "Fortinet", "Palo Alto",
            "AWS", "Azure", "Docker", "Ansible",
            "Python", "Go", "TypeScript", "React"
          ].map((tool, i) => (
            <motion.div
              key={tool}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.03 }}
              className="bg-surface-raised px-4 py-3 rounded-lg text-center font-medium text-text-primary hover:bg-surface-raised hover:text-text-accent transition-colors"
            >
              {tool}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
