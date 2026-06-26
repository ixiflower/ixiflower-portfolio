"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Code2, BookOpen, Zap } from "lucide-react";
import { personalData, courses } from "@/lib/data";

const highlights = [
  { icon: Code2, label: "Coding Since", value: "2019 (age 13)" },
  { icon: MapPin, label: "Location", value: personalData.location },
  { icon: Zap, label: "Currently", value: "OWASP Zero — Voorivex Academy" },
  { icon: BookOpen, label: "Hobby", value: "Volleyball" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-xs font-mono text-accent tracking-widest uppercase mb-3">
            About
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Who <span className="gradient-text">am I</span>?
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16">
          {/* Left - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 order-2 lg:order-1 space-y-4 sm:space-y-6"
          >
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              Hey! I&apos;m <span className="text-foreground font-medium">Amirabbas Rouintan</span>, 
              a self-taught developer from Karaj, Iran. I started coding at 13 and never looked back.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              Currently, I work as a backend & infrastructure engineer at{" "}
              <span className="text-foreground font-medium">Ecode Team</span>, 
              building scalable systems and managing cloud deployments. My toolkit spans 
              from Python and TypeScript to Docker, Kubernetes, and everything in between.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me on the volleyball court, 
              exploring cybersecurity, or tinkering with my Neovim config (Arch Linux, btw).
            </p>

            {/* Course list */}
            <div className="pt-4">
              <h3 className="text-sm font-mono text-accent tracking-widest uppercase mb-3 sm:mb-4">
                Courses & Certifications
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {courses.map((course) => (
                  <li
                    key={course}
                    className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right - Quick stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="glass-sm sm:glass rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 group hover:bg-card-hover transition-colors duration-300"
                >
                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <item.icon size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider truncate">
                      {item.label}
                    </p>
                    <p className="text-xs sm:text-sm font-medium mt-0.5 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
