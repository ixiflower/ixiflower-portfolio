export const personalData = {
  name: "Amirabbas Rouintan",
  handle: "ixi_flower",
  title: "Developer & Infrastructure Engineer",
  location: "Karaj, Iran",
  email: "amirabbasrouintan2007@gmail.com",
  telegram: "@ixi_flower",
  bio: "Self-taught developer since 2019. Building backend systems, cloud infrastructure, and crafting pixel-perfect frontends. Currently diving deep into cybersecurity at Voorivex Academy.",
  avatarUrl: "/avatar.jpg",
  resumeUrl: "#",
  socials: {
    github: "https://github.com/ixiflower",
    email: "mailto:amirabbasrouintan2007@gmail.com",
    telegram: "https://t.me/ixi_flower",
    youtube: "https://youtube.com/@ixi_flower",
  },
};

export interface Skill {
  name: string;
  level: number;
  category: "Language" | "Frontend" | "Backend" | "Database" | "DevOps" | "Security" | "Mobile" | "Systems";
  color: string;
}

export const skills: Skill[] = [
  { name: "Python", level: 98, category: "Language", color: "#3776AB" },
  { name: "HTML / CSS", level: 95, category: "Frontend", color: "#E34F26" },
  { name: "React / TypeScript", level: 90, category: "Frontend", color: "#61DAFB" },
  { name: "SQL / PostgreSQL", level: 84, category: "Database", color: "#336791" },
  { name: "Linux", level: 80, category: "Systems", color: "#FCC624" },
  { name: "Docker", level: 80, category: "DevOps", color: "#2496ED" },
  { name: "Kubernetes", level: 70, category: "DevOps", color: "#326CE5" },
  { name: "Cybersecurity", level: 65, category: "Security", color: "#FF0000" },
  { name: "Kotlin", level: 60, category: "Language", color: "#7F52FF" },
  { name: "C#", level: 55, category: "Language", color: "#239120" },
];

export const skillTags = [
  "Go", "Lua", "Tailwind CSS", "Neovim", "Arch Linux",
  "React Native", "Django", "Next.js", "Telethon",
  "Git", "Three.js", "Framer Motion", "Vite",
  "Nginx", "CI/CD", "Drizzle", "Neon",
];

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  category: string;
}

export const projects: Project[] = [
  {
    title: "SERENE",
    description: "Premium Shopify Hydrogen storefront with atmospheric hero, glassmorphic design, and full cart integration.",
    tech: ["TypeScript", "Hydrogen", "React Router", "Tailwind", "Shopify"],
    github: "https://github.com/ixiflower/serene",
    category: "E-Commerce",
  },
  {
    title: "Storipalorium",
    description: "Modern bookmark & snippet storage platform with Neon Auth, Drizzle ORM, file tree, rooms, and category management.",
    tech: ["Next.js", "TypeScript", "Drizzle", "Neon Auth", "Tailwind"],
    github: "https://github.com/ixiflower/Storipalorium",
    category: "Full-Stack",
  },
  {
    title: "ifi Planner",
    description: "Interactive 3D task planner with drag-and-drop, Three.js visualization, and Django backend.",
    tech: ["React", "TypeScript", "Three.js", "Django", "Vite"],
    github: "https://github.com/ixiflower/planner",
    category: "Full-Stack",
  },
  {
    title: "PolyBot TG",
    description: "Telegram bot for VPN/proxy automation with V2Ray config generation and connection testing.",
    tech: ["Python", "Telethon", "V2Ray"],
    github: "https://github.com/ixiflower/polybot-tg",
    category: "Automation",
  },
  {
    title: "Shopify Frost",
    description: "Headless Hydrogen storefront with dark/light theme toggle and glassmorphic UI components.",
    tech: ["TypeScript", "Hydrogen", "React Router", "Tailwind"],
    github: "https://github.com/ixiflower/shopify-frost",
    category: "E-Commerce",
  },
  {
    title: "Python TG Bot Maker",
    description: "No-code Telegram bot creation platform with visual workflow builder.",
    tech: ["Python", "React", "TypeScript", "Telegram API"],
    github: undefined,
    category: "Tooling",
  },
];

export const courses = [
  "OWASP Zero — Voorivex Academy (Current)",
  "CompTIA Network+ — Arjang Institute",
  "Security+ — Maktabkhooneh",
  "CEH — Maktabkhooneh (Jadi)",
  "Nmap Ethical Hacking — Udemy",
  "LPIC-1 Bootcamp — YouTube (Jadi)",
  "Kubernetes — YouTube (Codecamp)",
  "The Biggest React.js Course — YouTube",
  "Modern Python — Udemy",
];

export const experience = [
  {
    role: "Developer (Backend / Infra)",
    company: "Ecode Team",
    period: "Present",
    description: "Building scalable backend systems and managing cloud infrastructure.",
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
