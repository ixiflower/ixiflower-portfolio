"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills, skillTags } from "@/lib/data";

function SkillBar({
  name,
  level,
  color,
  index,
  inView,
}: {
  name: string;
  level: number;
  color: string;
  index: number;
  inView: boolean;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
              animation: inView ? "shimmer 2s infinite" : "none",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-accent tracking-widest uppercase mb-3">
            Skills
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Tech Stack & <span className="gradient-text">Expertise</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Core skills bars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {skills.map((skill, i) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                color={skill.color}
                index={i}
                inView={inView}
              />
            ))}
          </motion.div>

          {/* Tag cloud */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sm font-mono text-muted-foreground mb-6 tracking-wide uppercase">
              Also experienced with
            </p>
            <div className="flex flex-wrap gap-3">
              {skillTags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.3,
                    delay: 0.3 + i * 0.03,
                  }}
                  className="px-4 py-2 rounded-full text-xs font-medium border border-border/50 text-muted-foreground hover:border-accent/30 hover:text-accent transition-all duration-200 cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Category breakdown */}
            <div className="mt-10">
              <p className="text-sm font-mono text-muted-foreground mb-6 tracking-wide uppercase">
                By category
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { cat: "Languages", count: 4, color: "#3776AB" },
                  { cat: "Frontend", count: 3, color: "#61DAFB" },
                  { cat: "DevOps", count: 4, color: "#2496ED" },
                  { cat: "Security", count: 1, color: "#FF0000" },
                  { cat: "Database", count: 1, color: "#336791" },
                  { cat: "Mobile", count: 1, color: "#7F52FF" },
                ].map((cat) => (
                  <div
                    key={cat.cat}
                    className="glass rounded-xl p-4 text-center"
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: cat.color }}
                    >
                      {cat.count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {cat.cat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </section>
  );
}
