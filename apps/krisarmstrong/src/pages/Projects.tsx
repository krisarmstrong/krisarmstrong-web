import { motion } from 'framer-motion';
import { Code2, ExternalLink, Star, GitFork } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  topics?: string[];
  featured?: boolean;
}

const projects: Project[] = [
  {
    name: 'Wi-Fi Vigilante',
    description:
      'Comprehensive network investigation and troubleshooting platform used by network professionals worldwide. Features real-time packet analysis, RF spectrum visualization, and security assessment tools.',
    url: 'https://wi-fi-vigilante.com',
    stars: 0,
    language: 'TypeScript',
    topics: ['networking', 'security', 'wifi', 'troubleshooting'],
    featured: true,
  },
  {
    name: 'test-accessory-finder',
    description:
      'Network scanner to discover NetAlly Test Accessories running iPerf3 servers. Automates the discovery and configuration of network testing equipment.',
    url: 'https://github.com/krisarmstrong/test-accessory-finder',
    stars: 1,
    language: 'Python',
    topics: ['networking', 'netally', 'iperf3'],
    featured: true,
  },
  {
    name: 'niac-go',
    description:
      'Production-ready network device simulator with complete YAML configuration system for per-protocol testing. Supports multiple network protocols and realistic device behavior.',
    url: 'https://github.com/krisarmstrong/niac-go',
    stars: 0,
    language: 'Go',
    topics: ['networking', 'simulation', 'testing'],
    featured: true,
  },
  {
    name: 'netally-tools',
    description:
      'Comprehensive toolkit for NetAlly hardware devices. Provides CLI and SDK for automating network testing workflows.',
    url: 'https://github.com/krisarmstrong/netally-tools',
    stars: 0,
    language: 'Python',
    topics: ['netally', 'networking', 'automation'],
    featured: true,
  },
  {
    name: 'eap-test-suite',
    description:
      'Automated testing suite for EAP (Extensible Authentication Protocol) authentication methods. Validates wireless security configurations.',
    url: 'https://github.com/krisarmstrong/eap-test-suite',
    stars: 0,
    language: 'Python',
    topics: ['security', 'authentication', 'wifi', 'eap'],
    featured: true,
  },
  {
    name: 'network-tools',
    description:
      'Everything from network discovery, listener, parser, and analysis tools. Unified toolkit for network operations.',
    url: 'https://github.com/krisarmstrong/network-tools',
    stars: 0,
    language: 'Python',
    topics: ['networking', 'discovery', 'analysis'],
    featured: true,
  },
  {
    name: 'setup-podman-lab',
    description:
      'Full-featured local lab environment for developers, hackers, and network engineers. Complete containerized testing environment in one command.',
    url: 'https://github.com/krisarmstrong/setup-podman-lab',
    stars: 0,
    language: 'Shell',
    topics: ['podman', 'containers', 'lab', 'devops'],
  },
  {
    name: 'enigma-v300',
    description:
      'Complete collection of Enigma V300 option key algorithm implementations. Reverse-engineered NetAlly device option key system.',
    url: 'https://github.com/krisarmstrong/enigma-v300',
    stars: 0,
    language: 'Python',
    topics: ['security', 'reverse-engineering'],
  },
  {
    name: 'json-tools',
    description:
      'Single CLI/SDK for every JSON/CSV/XML workflow. Unified data transformation and manipulation toolkit.',
    url: 'https://github.com/krisarmstrong/json-tools',
    stars: 0,
    language: 'Python',
    topics: ['json', 'csv', 'xml', 'data-processing'],
  },
  {
    name: 'video-tools',
    description:
      'Unified CLI + SDK for downloading videos via yt-dlp or scripted scraping with Selenium.',
    url: 'https://github.com/krisarmstrong/video-tools',
    stars: 0,
    language: 'Python',
    topics: ['video', 'download', 'automation'],
  },
  {
    name: 'file-tools',
    description:
      'Successor to file_organizer, file_sorter, game_file_renamer. Unified file management toolkit.',
    url: 'https://github.com/krisarmstrong/file-tools',
    stars: 0,
    language: 'Python',
    topics: ['file-management', 'automation'],
  },
  {
    name: 'pro-dev-templates',
    description:
      'Production-grade starter templates for Python, Node.js, and C++ projects with best practices built-in.',
    url: 'https://github.com/krisarmstrong/pro-dev-templates',
    stars: 0,
    language: 'Python',
    topics: ['templates', 'development', 'best-practices'],
  },
];

const languageColors: Record<string, string> = {
  TypeScript: 'bg-brand-accent',
  Python: 'bg-yellow-500',
  Go: 'bg-cyan-500',
  Shell: 'bg-green-500',
  JavaScript: 'bg-amber-500',
};

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      {/* Featured Projects */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-surface-raised p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all border border-surface-border hover:border-brand-accent/50"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                  <Code2 size={20} className="text-text-accent" />
                  {project.name}
                </h3>
                {project.stars > 0 && (
                  <div className="flex items-center gap-1 text-text-muted text-sm">
                    <Star size={14} className="text-yellow-400" />
                    <span>{project.stars}</span>
                  </div>
                )}
              </div>
              <p className="text-text-primary text-sm mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`${languageColors[project.language]} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {project.language}
                </span>
                {project.topics?.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="bg-surface-raised text-text-primary text-xs px-2 py-1 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-accent hover:text-interactive-hover text-sm font-medium transition-colors"
              >
                View Project
                <ExternalLink size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Other Projects */}
      <div>
        <h2 className="text-2xl font-bold mb-6">More Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherProjects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-surface-raised p-4 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all border border-surface-border hover:border-brand-accent/50"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">{project.name}</h3>
              <p className="text-text-muted text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`${languageColors[project.language]} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {project.language}
                </span>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-accent hover:text-interactive-hover transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* GitHub Profile Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <a
          href="https://github.com/krisarmstrong"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-accent hover:bg-interactive-hover text-surface-raised px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          <GitFork size={20} />
          View All Projects on GitHub
        </a>
      </motion.div>
    </section>
  );
}
