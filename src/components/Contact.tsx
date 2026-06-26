"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { personalData } from "@/lib/data";

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    href: personalData.socials.email,
    color: "hover:text-[#EA4335]",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    href: personalData.socials.github,
    color: "hover:text-[#fff]",
  },
  {
    icon: Send,
    label: "Telegram",
    href: personalData.socials.telegram,
    color: "hover:text-[#0088cc]",
  },
  {
    icon: YoutubeIcon,
    label: "YouTube",
    href: personalData.socials.youtube,
    color: "hover:text-[#FF0000]",
  },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-3xl text-center">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono text-accent tracking-widest uppercase mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed">
            Whether you have a project in mind, want to collaborate, or just
            want to say hi — my inbox is always open.
          </p>
        </motion.div>

        {/* Contact links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto")
                  ? undefined
                  : "noopener noreferrer"
              }
              className={`glass rounded-xl px-6 py-4 flex items-center gap-3 text-sm font-medium text-muted-foreground ${link.color} transition-all duration-300 hover:scale-105`}
            >
              <link.icon size={18} />
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Email */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <a
            href={`mailto:${personalData.email}`}
            className="text-sm font-mono text-muted-foreground hover:text-accent transition-colors"
          >
            {personalData.email}
          </a>
        </motion.p>
      </div>
    </section>
  );
}
