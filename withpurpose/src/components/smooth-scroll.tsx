"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis-powered inertial smooth scrolling for the whole document.
 * Disabled for reduced-motion users (native scroll remains).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });

    // Late-loading images change the page height; make sure the scroll
    // limit is refreshed once everything has arrived.
    const onLoad = () => lenis.resize();
    window.addEventListener("load", onLoad);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
