"use client";

import { useLenis } from "./LenisProvider";

export default function ScrollProgress() {
  const { scrollProgress } = useLenis();

  return (
    <div
      id="progress-track"
      className="fixed top-0 right-0 w-[2px] h-screen z-[100] pointer-events-none"
      style={{ background: "rgba(136,85,255,0.12)" }}
    >
      <div
        className="w-full h-full origin-top transition-transform duration-100 ease-out"
        style={{
          background: "rgba(136,85,255,0.7)",
          transform: `scaleY(${scrollProgress})`,
        }}
      />
    </div>
  );
}
