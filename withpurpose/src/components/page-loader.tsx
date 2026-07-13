"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { boot } from "@/lib/boot";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Brand intro on every full page load: felt curtain, the chip logo settles
 * in, a giant counter surges to 100, then the curtain lifts. Ships in the
 * server HTML for a flash-free first paint; reduced-motion users skip it.
 */
export function PageLoader() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduce) {
      boot.done = true;
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          boot.done = true;
          setPhase("done");
        }, 240);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (phase === "done") document.documentElement.style.overflow = "";
  }, [phase]);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="loader"
          className="wp-loader fixed inset-0 z-[1000] flex flex-col justify-between overflow-hidden bg-(image:--grad-dark) p-[clamp(1.5rem,4vw,3rem)] text-cream"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE_EXPO }}
        >
          <div aria-hidden className="glow-gold pointer-events-none absolute inset-x-0 top-0 h-1/2" />

          {/* Chip logo — centre */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_EXPO }}
            className="absolute inset-0 grid place-items-center"
          >
            <Image
              src="/logo.webp"
              alt="With Purpose Academy"
              width={220}
              height={220}
              priority
              className="size-40 rounded-3xl object-cover sm:size-52"
            />
          </motion.div>

          <span aria-hidden className="text-[0.7rem] font-bold tracking-[0.3em] text-cream-faint uppercase">
            With Purpose Academy
          </span>

          {/* Counter — bottom */}
          <div className="relative flex items-end justify-between gap-6">
            <div className="mb-3 h-px flex-1 overflow-hidden bg-white/15">
              <div
                className="h-full bg-(image:--grad-gold) transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-display text-[clamp(4rem,12vw,8.5rem)] leading-none tracking-tight tabular">
              {progress}
              <span className="text-[0.35em] text-cream-faint">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
