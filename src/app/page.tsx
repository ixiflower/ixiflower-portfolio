"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <div className="relative min-h-dvh">
      {/* Three.js ASCII donat background */}
      <Scene />

      {/* Foreground content */}
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <div className="section-divider mx-auto max-w-6xl" />
          <About />
          <div className="section-divider mx-auto max-w-6xl" />
          <Skills />
          <div className="section-divider mx-auto max-w-6xl" />
          <Projects />
          <div className="section-divider mx-auto max-w-6xl" />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
