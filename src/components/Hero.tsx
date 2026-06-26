"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ExternalLink } from "lucide-react";
import { personalData } from "@/lib/data";

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

function Word({ children, progress }: { children: string; progress: number }) {
  return (
    <span
      className="inline-block transition-all duration-300"
      style={{
        opacity: Math.max(0, Math.min(1, progress)),
        transform: `translateY(${(1 - Math.max(0, Math.min(1, progress))) * 24}px)`,
      }}
    >
      {children}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.85, 0.95], [1, 0.8, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.92]);
  const avatarScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.85]);
  const avatarOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.5, 0.65], [1, 0.6, 0]);
  const ctaY = useTransform(scrollYProgress, [0, 0.6], [0, 20]);
  const scrollIndOpacity = useTransform(scrollYProgress, [0, 0.12, 0.25], [1, 0.5, 0]);

  const nameWords = useMemo(() => personalData.name.split(" "), []);
  const titleWords = useMemo(() => personalData.title.split(" "), []);

  const [scrollP, setScrollP] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", setScrollP);
    return () => unsub();
  }, [scrollYProgress]);

  const progressAt = (start: number, end: number) =>
    Math.max(0, Math.min(1, (scrollP - start) / (end - start)));

  return (
    <div ref={sectionRef} className="h-[200vh] sm:h-[300vh] relative">
      <motion.div
        className="fixed inset-0 z-10 flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] aspect-square rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(136,85,255,0.12) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 text-center max-w-3xl w-full px-5">
          {/* Avatar */}
          <motion.div style={{ scale: avatarScale, opacity: avatarOpacity }} className="relative inline-block mx-auto mb-5 sm:mb-8">
            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-2 ring-accent/40">
              <img src="/avatar.jpg" alt={personalData.name} className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute inset-0 rounded-full animate-spin-slow pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(136,85,255,0.3), transparent, rgba(136,85,255,0.15), transparent)",
                WebkitMaskImage: "radial-gradient(circle, transparent 42%, black 44%)",
                maskImage: "radial-gradient(circle, transparent 42%, black 44%)",
              }}
            />
          </motion.div>

          {/* Greeting */}
          <p className="text-xs sm:text-sm font-mono text-accent/60 tracking-widest uppercase mb-2">
            {(() => {
              const words = "Hi, I'm".split(" ");
              return words.map((w, i) => (
                <React.Fragment key={i}>
                  <Word progress={progressAt(0.01, 0.08) - i * 0.02}>{w}</Word>
                  {i < words.length - 1 && <span>&nbsp;</span>}
                </React.Fragment>
              ));
            })()}
          </p>

          {/* Name */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            {nameWords.map((w: string, i: number) => (
              <Word key={i} progress={progressAt(0.04, 0.15) - i * 0.03}>
                {i === 0 ? w : ` ${w}`}
              </Word>
            ))}
          </h1>

          {/* Title */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mt-2 sm:mt-4">
            {titleWords.map((w: string, i: number) => (
              <Word key={i} progress={progressAt(0.1, 0.25) - i * 0.02}>
                {i === 0 ? w : ` ${w}`}
              </Word>
            ))}
          </p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <a
              href={personalData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 border border-[rgba(136,85,255,0.25)]"
              style={{ background: "rgba(136,85,255,0.12)", color: "#a78bfa" }}
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href={personalData.socials.email}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink size={14} /> Contact
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
            style={{ opacity: scrollIndOpacity }}
          >
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-accent/40 uppercase">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowDown size={12} className="text-accent/40" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
