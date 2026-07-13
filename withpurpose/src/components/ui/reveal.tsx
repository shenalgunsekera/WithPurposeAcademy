"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealKind = "up" | "fade" | "scale" | "blur" | "left" | "right";

const kinds: Record<
  RevealKind,
  { hidden: Record<string, number | string>; shown: Record<string, number | string> }
> = {
  up: { hidden: { opacity: 0, y: 26 }, shown: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, shown: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, y: 18, filter: "blur(8px)" }, shown: { opacity: 1, y: 0, filter: "blur(0px)" } },
  left: { hidden: { opacity: 0, x: -32 }, shown: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 }, shown: { opacity: 1, x: 0 } },
};

/**
 * Single in-view reveal. Pick the `kind` that fits what's being revealed —
 * varied, intentional motion, not one fade applied to everything.
 */
export function Reveal({
  children,
  kind = "up",
  delay = 0,
  duration = 0.7,
  className,
  as = "div",
  amount = 0.3,
  once = true,
}: {
  children: ReactNode;
  kind?: RevealKind;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section" | "article" | "figure" | "p" | "h2";
  amount?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  const v = kinds[kind];

  if (reduce) {
    const Static = as as "div";
    return <Static className={className}>{children}</Static>;
  }

  return (
    <M
      className={className}
      initial={v.hidden}
      whileInView={v.shown}
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Staggered group: children reveal in sequence as the container enters view. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  amount = 0.2,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  as?: "div" | "ul" | "ol" | "section";
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;

  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren } },
  };

  return (
    <M
      className={className}
      variants={container}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  kind = "up",
  duration = 0.7,
  className,
  as = "div",
}: {
  children: ReactNode;
  kind?: RevealKind;
  duration?: number;
  className?: string;
  as?: "div" | "li" | "article" | "figure" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  const v = kinds[kind];

  const variants: Variants = {
    hidden: reduce ? { opacity: 1 } : v.hidden,
    shown: { ...v.shown, transition: { duration: reduce ? 0 : duration, ease: EASE } },
  };

  return (
    <M className={className} variants={variants}>
      {children}
    </M>
  );
}
