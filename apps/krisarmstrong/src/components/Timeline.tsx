import { motion } from "framer-motion";

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

const items: TimelineItem[] = [
  {
    year: "2025",
    title: "Founded Armstrong Consulting LLC",
    desc: "Delivering enterprise network engineering, wireless design, and security solutions to clients nationwide.",
  },
  {
    year: "2024",
    title: "Launched Wi-Fi Vigilante",
    desc: "Created a modern case-based network storytelling platform.",
  },
  {
    year: "2018",
    title: "CWDP, CWSP, CISSP Achieved",
    desc: "Advanced wireless, security, and design certifications.",
  },
  // ...more milestones as you want
];

export default function Timeline() {
  return (
    <div className="relative pl-8 my-12">
      <div className="absolute left-2 top-0 bottom-0 w-1 bg-brand-accent rounded-full" />
      <ul>
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="mb-10 ml-2"
          >
            <div className="flex items-center gap-4">
              <span className="bg-brand-accent w-6 h-6 rounded-full flex items-center justify-center text-white font-bold shadow-lg">{item.year}</span>
              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>
            <p className="ml-10 mt-2 text-text-muted">{item.desc}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
