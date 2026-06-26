"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { personalData } from "@/lib/data";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Detect touch device
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const onMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    // On touch devices, use device orientation or just center
    if (!isTouch) {
      window.addEventListener("mousemove", onMouse);
    }
    return () => window.removeEventListener("mousemove", onMouse);
  }, [isTouch]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-dvh flex flex-col items-center justify-center px-5 sm:px-6 overflow-hidden"
    >
      {/* Ambient glow - responsive sizing */}
      <div
        id="hero-glow"
        className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(136,85,255,0.4) 0%, transparent 70%)",
          transform: isTouch
            ? "none"
            : `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl w-full">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm md:text-base font-mono text-accent mb-3 sm:mb-4 tracking-widest uppercase"
        >
          Hello, I&apos;m
        </motion.p>

        {/* Name - smaller on really small screens */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight"
        >
          <span className="gradient-text">{personalData.handle}</span>
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-2xl text-muted-foreground font-light mb-6 sm:mb-8"
        >
          {personalData.title}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xs sm:text-sm md:text-base text-muted-foreground/60 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
        >
          Self-taught developer since 2019. Building backend systems, cloud
          infrastructure, and crafting pixel-perfect frontends. Currently diving
          deep into cybersecurity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href={`mailto:${personalData.email}`}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-accent text-white text-xs sm:text-sm font-medium hover:bg-accent-glow transition-all duration-300 animate-pulse-glow w-full sm:w-auto justify-center"
          >
            <Mail size={16} />
            Get in Touch
          </a>
          <a
            href={personalData.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-border text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={scrollToAbout}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-accent transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </motion.button>
    </section>
  );
}
