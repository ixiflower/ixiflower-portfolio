"use client";

import { useRef, useEffect, useState, createContext, useContext, type ReactNode } from "react";
import Lenis from "lenis";

interface LenisContextType {
  lenis: Lenis | null;
  scrollProgress: number;
}

const LenisContext = createContext<LenisContextType>({ lenis: null, scrollProgress: 0 });

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Track scroll progress
    lenis.on("scroll", (e: { progress: number }) => {
      setScrollProgress(e.progress);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollProgress }}>
      {children}
    </LenisContext.Provider>
  );
}
