"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills, skillTags } from "@/lib/data";

function SkillBar({ name, level, color, index }: { name: string; level: number; color: string; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { once: true, margin: "-50px" });

  return (
    <div ref={barRef} className="group">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <span className="text-xs sm:text-sm font-medium">{name}</span>
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-1.5 sm:h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full relative"
          style={{
            backgroundColor: color,
            width: inView ? `${level}%` : "0%",
            transition: `width 1s ease-out ${index * 0.1}s`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
              animation: inView ? "shimmer 2s infinite" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Tag cloud component
function SkillTag({ tag, index }: { tag: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium border border-border/50 text-muted-foreground hover:border-accent/30 hover:text-accent transition-all duration-200 cursor-default"
    >
      {tag}
    </motion.span>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const categoryCounts = skills.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  const categoryColors: Record<string, string> = {
    Language: "#3776AB",
    Frontend: "#61DAFB",
    DevOps: "#2496ED",
    Security: "#FF0000",
    Database: "#336791",
    Mobile: "#7F52FF",
  };

  return (
    <section id="skills" ref={ref} className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-xs font-mono text-accent tracking-widest uppercase mb-3">
            Skills
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Tech Stack & <span className="gradient-text">Expertise</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left - Skill bars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 sm:space-y-5 lg:space-y-6"
          >
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} {...skill} index={i} />
            ))}
          </motion.div>

          {/* Right - Tags & Categories */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tag cloud */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8 sm:mb-10">
              {skillTags.map((tag, i) => (
                <SkillTag key={tag} tag={tag} index={i} />
              ))}
            </div>

            {/* Category breakdown */}
            <p className="text-xs sm:text-sm font-mono text-muted-foreground mb-4 sm:mb-6 tracking-wide uppercase">
              By category
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="glass-sm sm:glass rounded-xl p-3 sm:p-4 text-center">
                  <p style={{ color: categoryColors[cat] || "#8855ff" }} className="text-lg sm:text-2xl font-bold">
                    {count}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {cat}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
