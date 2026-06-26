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
  longDescription: string;
  highlights: string[];
  tech: string[];
  github?: string;
  live?: string;
  category: string;
  status: "Active" | "Archived" | "WIP";
  year: number;
}

export const projects: Project[] = [
  {
    title: "SERENE",
    description: "Premium Shopify Hydrogen storefront with atmospheric hero, glassmorphic design, and full cart integration.",
    longDescription: "A headless e-commerce storefront built with Shopify Hydrogen and React Router. Features a stunning atmospheric hero section with 3D-like glassmorphic design elements, smooth page transitions, and a fully integrated cart system with real-time inventory syncing.",
    highlights: [
      "Atmospheric hero with ambient 3D blob effects",
      "Full cart integration with real-time sync",
      "Glassmorphic design system with smooth animations",
      "Responsive layout with mobile-first approach",
      "SEO-optimized meta and structured data",
    ],
    tech: ["TypeScript", "Hydrogen", "React Router", "Tailwind", "Shopify"],
    github: "https://github.com/ixiflower/serene",
    category: "E-Commerce",
    status: "Active",
    year: 2026,
  },
  {
    title: "Storipalorium",
    description: "Modern bookmark & snippet storage platform with Neon Auth, Drizzle ORM, file tree, and room management.",
    longDescription: "A full-stack bookmark and code snippet storage application with team collaboration features. Built on Next.js 16 with Neon Auth for authentication, Drizzle ORM for type-safe database queries, and a hierarchical file tree for organizing resources.",
    highlights: [
      "Team rooms with invite-based access control",
      "Hierarchical file tree with drag organization",
      "Neon Auth integration with social login support",
      "Drizzle ORM with PostgreSQL for type-safe queries",
      "Client-side session handling with fallbacks",
    ],
    tech: ["Next.js 16", "TypeScript", "Drizzle", "Neon Auth", "Tailwind"],
    github: "https://github.com/ixiflower/Storipalorium",
    category: "Full-Stack",
    status: "Active",
    year: 2026,
  },
  {
    title: "ifi Planner",
    description: "Interactive 3D task planner with drag-and-drop, Three.js visualization, and Django backend.",
    longDescription: "A visually immersive task planning application that uses Three.js for 3D task visualization. Tasks appear as interactive 3D objects that can be dragged, rescheduled, and organized in a spatial environment. Backend powered by Django REST Framework.",
    highlights: [
      "3D task visualization with Three.js",
      "Drag-and-drop task rearrangement",
      "Django REST API with PostgreSQL",
      "Real-time updates via WebSocket",
      "Custom 3D object manipulation controls",
    ],
    tech: ["React", "TypeScript", "Three.js", "Django", "Vite"],
    github: "https://github.com/ixiflower/planner",
    category: "Full-Stack",
    status: "WIP",
    year: 2026,
  },
  {
    title: "PolyBot TG",
    description: "Telegram bot for VPN/proxy automation with V2Ray config generation and connection testing.",
    longDescription: "A fully automated Telegram bot that generates V2Ray VPN configurations on-demand, tests connection health, and manages user subscriptions. Built with Telethon for MTProto integration and featuring a modular command system.",
    highlights: [
      "Automated V2Ray config generation",
      "Connection health testing and monitoring",
      "User subscription management system",
      "MTProto integration via Telethon",
      "Modular command architecture",
    ],
    tech: ["Python", "Telethon", "V2Ray"],
    github: "https://github.com/ixiflower/polybot-tg",
    category: "Automation",
    status: "Active",
    year: 2025,
  },
  {
    title: "Shopify Frost",
    description: "Headless Hydrogen storefront with dark/light theme toggle and glassmorphic UI components.",
    longDescription: "A themed Shopify Hydrogen storefront showcasing advanced UI capabilities — smooth dark/light theme switching with persistent user preference storage, reusable glassmorphic component library, and optimized product discovery flow.",
    highlights: [
      "Dark/light theme toggle with system preference detection",
      "Reusable glassmorphic component library",
      "Optimized product listing with filtering",
      "Theme-persistent user preferences",
      "Responsive design with smooth transitions",
    ],
    tech: ["TypeScript", "Hydrogen", "React Router", "Tailwind"],
    github: "https://github.com/ixiflower/shopify-frost",
    category: "E-Commerce",
    status: "Archived",
    year: 2025,
  },
  {
    title: "Python TG Bot Maker",
    description: "No-code Telegram bot creation platform with visual workflow builder.",
    longDescription: "A drag-and-drop Telegram bot builder that lets users create complex bot workflows without writing code. Features a visual flow editor, pre-built action blocks, and one-click deployment to cloud servers.",
    highlights: [
      "Visual workflow builder with drag-and-drop",
      "Pre-built action blocks library",
      "One-click deployment pipeline",
      "Real-time bot testing environment",
      "User authentication and project management",
    ],
    tech: ["Python", "React", "TypeScript", "Telegram API"],
    github: undefined,
    category: "Tooling",
    status: "WIP",
    year: 2025,
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
