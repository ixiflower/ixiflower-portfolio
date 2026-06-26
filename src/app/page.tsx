"use client";

import dynamic from "next/dynamic";
import LenisProvider, { useLenis } from "@/components/LenisProvider";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
});

function PageContent() {
  const { scrollProgress } = useLenis();

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Scene scrollProgress={scrollProgress} />
      <Header />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <LenisProvider>
      <PageContent />
    </LenisProvider>
  );
}
