"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, Calendar, GitBranch, Sparkles } from "lucide-react";
import { projects } from "@/lib/data";

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const categoryColors: Record<string, string> = {
  "E-Commerce": "#a855f7",
  "Full-Stack": "#8855ff",
  "Automation": "#6366f1",
  "Tooling": "#8b5cf6",
};

const statusColors: Record<string, string> = {
  Active: "#22c55e",
  Archived: "#71717a",
  WIP: "#eab308",
};

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="projects" ref={ref} className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-xs font-mono text-accent tracking-widest uppercase mb-3">Projects</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Things I&apos;ve <span className="gradient-text">Built</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`group relative glass-sm sm:glass rounded-2xl overflow-hidden transition-all duration-300 ${
                expanded === project.title ? "ring-1 ring-accent/30" : ""
              }`}
            >
              {/* Gradient header bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${categoryColors[project.category] || "#8855ff"}, ${categoryColors[project.category] || "#8855ff"}44)`,
                }}
              />

              <div className="p-5 sm:p-6 flex flex-col">
                {/* Top row: category + status */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span
                    className="inline-flex px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-medium uppercase tracking-wider"
                    style={{
                      backgroundColor: `${categoryColors[project.category] || "#8855ff"}15`,
                      color: categoryColors[project.category] || "#8855ff",
                    }}
                  >
                    {project.category}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono"
                    style={{
                      backgroundColor: `${statusColors[project.status]}15`,
                      color: statusColors[project.status],
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[project.status] }} />
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold mb-1.5 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>

                {/* Short description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Year badge */}
                <div className="flex items-center gap-1.5 mb-3 text-[10px] sm:text-xs text-muted-foreground/60">
                  <Calendar size={10} />
                  <span>{project.year}</span>
                </div>

                {/* Expandable details */}
                <AnimatePresence>
                  {expanded === project.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-3 space-y-3 border-t border-border/20">
                        {/* Long description */}
                        <p className="text-[11px] sm:text-xs text-muted-foreground/70 leading-relaxed">
                          {project.longDescription}
                        </p>

                        {/* Highlights */}
                        <div>
                          <p className="text-[10px] sm:text-[11px] font-mono text-accent/80 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Sparkles size={10} />
                            Key Features
                          </p>
                          <ul className="space-y-1">
                            {project.highlights.map((h, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground/70">
                                <span className="mt-0.5 w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4 mt-auto">
                  {project.tech.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-zinc-800/50 text-muted-foreground border border-border/30"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tech.length > 6 && (
                    <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono text-muted-foreground/50">
                      +{project.tech.length - 6}
                    </span>
                  )}
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <GithubIcon size={13} />
                        Source
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={11} />
                        Demo
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === project.title ? null : project.title)}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    <span>{expanded === project.title ? "Less" : "More"}</span>
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-300 ${
                        expanded === project.title ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
