"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Simulate loading: fast at start, slow at end
        const increment = prev < 50 ? 8 + Math.random() * 12
                      : prev < 80 ? 3 + Math.random() * 6
                      : prev < 95 ? 0.5 + Math.random() * 2
                      : 0.1;
        const next = Math.min(100, prev + increment);
        if (next >= 100 && mounted) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
        }
        return next;
      });
    }, 150);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
          style={{ background: "#030303" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Brand mark */}
          <motion.h1
            className="text-[clamp(26px,7vw,48px)] font-serif tracking-[0.22em] pl-[0.22em]"
            style={{ color: "#8855ff", fontWeight: 500 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ixi
          </motion.h1>

          {/* Subtag */}
          <motion.p
            className="mt-3 text-[11px] font-mono tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Loading the ritual...
          </motion.p>

          {/* Progress bar */}
          <div
            className="mt-10 w-[200px] h-[2px] rounded-full overflow-hidden"
            style={{ background: "rgba(136,85,255,0.15)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#8855ff", width: `${progress}%` }}
              layout
            />
          </div>

          {/* Progress %
          <p className="mt-3 text-[10px] font-mono" style="color:rgba(255,255,255,0.2)">
            {Math.round(progress)}%
          </p> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
