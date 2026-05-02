"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

// Strong ease-out curve. Built-in easings feel weak; this one matches the
// rest of the design system (mirrored from globals.css var --ease-out-strong).
const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

// Subtle entry offsets. Emil's principle: small motion reads as natural,
// big motion (40px+) reads as marketing reveal.
const directions = {
  up: { y: 8, x: 0 },
  down: { y: -8, x: 0 },
  left: { x: 8, y: 0 },
  right: { x: -8, y: 0 },
  none: { x: 0, y: 0 },
};

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.4,
  className = "",
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  // With reduced motion: keep the opacity fade for comprehension, drop the
  // positional change. Movement is what causes vestibular issues, not opacity.
  const initial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, ...directions[direction] };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: STRONG_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
